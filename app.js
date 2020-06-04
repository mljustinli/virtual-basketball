// app.js
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var Game = require("./js/Game");
// var Basketball = require("./basketball");
//var Game = require("./game");

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

//var game = new Game(1);

let socketList = {};
var games = {};
games[1] = new Game();

io.on("connection", function (socket) {
  var player = {};

  player.id = idTracker;
  //game.prototype.addPlayer(player);

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
    // TODO associate initials with player object
    // socket.initials = data;
    games[socket.gameID].updatePlayerInitials(data.id, data.initials);
    console.log("Received player initials: " + data.initials);
  });
   let teamTracker= {};
  socket.on("teamChoice", function(data){
    teamChoice=data;
    teamTracker[socket.id]=teamChoice;
    console.log("Team choice is "+ teamChoice);
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
      socketList[key].emit("drawData", newData);
      socketList[key].emit("updateScore", {
        team1Score: game.score["Team 1"],
        team2Score: game.score["Team 2"],
      });
    }
  }
  1000 / 30;
});

server.listen(process.env.PORT || 3000);
