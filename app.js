// app.js
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
<<<<<<< HEAD
var Game = require("./Client/js/Game.js");
=======
// var Basketball = require("./basketball");
//var Game = require("./game");

var LOGGING = true;
function log(str) {
  if (LOGGING) {
    console.log(str);
  }
}
>>>>>>> rooms

app.use(express.static(__dirname + "/client"));
app.get("/", function (req, res, next) {
  res.sendFile(__dirname + "/client/index.html");
});

let idTracker = 0;

//var game = new Game(1);

let socketList = {};
let currSocket;
var games = {};
games[1] = new Game();

io.on("connection", function (socket) {
  var player = {};

  player.id = idTracker;
  //game.prototype.addPlayer(player);

  socket.pos = { x : 0, y : 240};
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
<<<<<<< HEAD
    games[socket.gameID].updatePlayer(data.id, data.dx, data.dy);
=======
<<<<<<< HEAD
     console.log("receiving updatepos message");
    // game.movePlayer(data)
    socketList[data.id].pos.y -= data.delta;
    socketList[data.id].pos.x += data.alpha;
    console.log(socketList[data.id].pos.y);
    console.log(socketList[data.id].pos.x);
=======
    // console.log("receiving updatepos message");
    socketList[data.id].pos.y -= data.dx;
    socketList[data.id].pos.x += data.dy;
  });
  socket.on("updateAngle", function (data) {
    // TODO update player angle in a player object, but for now
    // it's with a socket
    socketList[data.id].angle = data.angle;
>>>>>>> master
>>>>>>> rooms
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
