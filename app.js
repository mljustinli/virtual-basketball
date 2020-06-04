// app.js
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var CONSTANTS = require("./client/js/clientConstants.js");
var Game = require("./js/Game");

var LOGGING = true;
function log(str) {
  if (LOGGING) {
    console.log(str);
  }
}

app.use(express.static(__dirname + "/client"));
app.get("/", function (req, res, next) {
  res.sendFile(__dirname + "/client/index.html");
});

let idTracker = 1;

let socketList = {};
var games = {};
games[1] = new Game();

io.on("connection", function (socket) {
  var player = {};

  player.id = idTracker;

  socket.id = idTracker;
  socketList[socket.id] = socket;
  socket.emit("giveID", socket.id);
  idTracker++;
  socket.gameID = 1;
  games[socket.gameID].connect(socket.id, socket.initials);
  console.log("Client connected...");
  console.log("Client id is: " + socket.id);
  console.log("IP address is: " + socket.request.connection.remoteAddress);

  socket.on("disconnect", function () {
    console.log("disconnected!");
    games[socket.gameID].disconnect(socket.id);
    delete socketList[socket.id];
    delete socket.id;
    delete socket.gameID;
    delete socket.initials;
  });

  socket.on("updatePos", function (data) {
    games[socket.gameID].updatePlayer(data.id, data.dx, data.dy);
  });
  socket.on("updateAngle", function (data) {
    games[socket.gameID].updatePlayerAngle(data.id, data.angle);
  });

  socket.on("initials", function (data) {
    games[socket.gameID].updatePlayerInitials(data.id, data.initials);
    console.log("Received player initials: " + data.initials);
  });

  let teamTracker = {};
  socket.on("teamChoice", function (data) {
    teamChoice = data.team;
    games[socket.gameID].players[data.id].setTeam(
      teamChoice === "TEAM_1" ? CONSTANTS.TEAM_1 : CONSTANTS.TEAM_2
    );
    // teamTracker[socket.id] = teamChoice;
    // console.log("Team choice is " + teamChoice);
  });

  socket.on("leftMouseClick", function (data) {
    currGame = games[socket.gameID];
    player = currGame.players[data.id];
    baller = currGame.ball.player;
    // interpret left click as attempt to catch
    if (baller==null) {
      currGame.catchEventChecker(player);
    }
    // if player in possession throw ball on left click
    else if (baller.id == data.id) {
      currGame.ball.throw(baller.angle, 0.5);
    }
  });
});

setInterval(function () {
  let key;
  for (key of Object.keys(games)) {
    game = games[key];
    game.update();
    // Emit update to players
    let newData = game.draw();
    for (let key in game.players) {
      if (socketList[key]) {
        socketList[key].emit("drawData", newData);
        socketList[key].emit("updateScore", {
          team1Score: game.score["Team 1"],
          team2Score: game.score["Team 2"],
        });
      }
    }
  }
  1000 / 30;
});

server.listen(process.env.PORT || 3000);
