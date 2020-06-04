// app.js
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var Game = require("./Client/js/Game.js");

app.use(express.static(__dirname + "/client"));
app.get("/", function (req, res, next) {
  res.sendFile(__dirname + "/client/index.html");
});

let idTracker = 0;

let socketList = {};
let currSocket;
var games = {};
games[1] = new Game();

io.on("connection", function (socket) {
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

  socket.on("initials", function (data) {
    // TODO associate initials with player object
    socket.initials = data;
    console.log("Received player initials: " + socket.initials);
  });
});

setInterval(function () {
<<<<<<< HEAD
  let key;
  for(key of Object.keys(games)) {
    game = games[key];
    game.update();
    // Emit update to players
    let newData = game.draw();
    let player;
    for(player of game.getPlayers()) {
      socketList[player].emit("drawData", newData);
    }
=======
  let playerPositions = {};
  let playerAngles = {};
  for (let key in socketList) {
    playerPositions[key] = socketList[key].pos;
    playerAngles[key] = socketList[key].angle;
  }

  for (let key in socketList) {
    // Assume the background and the hoops are static and drawn automatically on player side
    socketList[key].emit("updatePlayers", playerPositions);
    socketList[key].emit("updateAngles", playerAngles);
    // TODO actually emit the score
    socketList[key].emit("updateScore", { redScore: 0, blueScore: 0 });
    // socketList[key].emit("updateBall", ball);
>>>>>>> master
  }
}, 1000 / 30);

server.listen(process.env.PORT || 3000);
