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
  currSocket = socket;
  socket.emit("giveID", socket.id);
  idTracker++;
  socket.gameID = 1;
  socket.team = "red";
  games[socket.gameID].connect(socket.id, socket.initials, socket.team);
  console.log("Client connected...");
  console.log("Client id is: " + socket.id);
  console.log("IP address is: " + socket.request.connection.remoteAddress);

  socket.on("join", function (data) {
    console.log("Received join message from client");
  });

  socket.on("disconnect", function () {
    console.log("disconnected!");
    delete socket.pos;
    delete currSocket;
    delete socketList[currSocket];
    delete socket.id;
  });
  socket.on("updatePos", function (data) {
    games[socket.gameID].updatePlayer(data.id, data.dx, data.dy);
  });
  socket.on("updateAngle", function (data) {
    games[socket.gameID].updatePlayerAngle(data.id, data.angle);
  });
  socket.on("updateThrowPower", function (data) {
    games[socket.gameID].players[data.id].throwPower = data.power;
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

  socket.on("restartGame", function (id) {
    let key;
    for (key of Object.keys(games)) {
      let g = games[key];
      let p;
      for (p of g.getPlayers()) {
        if (p.id == id) {
          g.restart();
        }
      }
    }
  });
});

// Main Game
// Create the necessary game attributes
// var ball = new Basketball();
var hoops = [];
// hoops.push(new Hoop());
// hoops.push(new Hoop());
var PLAYER_SIZE = 20;

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

    let currScore = game.score;
    if (currScore["Team 1"] >= 11 || currScore["Team 2"] >= 11) {
      var winner;
      if (currScore["Team 1"] >= 11) {
        winner = "Team 1";
      }
      if (currScore["Team 2"] >= 11) {
        winner = "Team 2";
      }
      let s;
      for (s of game.getPlayers()) {
        socketList[s].emit("winReceiver", winner);
      }
    }
  }
}, 1000 / 30);

server.listen(process.env.PORT || 3000);
