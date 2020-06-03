// app.js
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

app.use(express.static(__dirname + "/client"));
app.get("/", function (req, res, next) {
  res.sendFile(__dirname + "/client/index.html");
});

let idTracker = 0;

let socketList = {};
let currSocket;

io.on("connection", function (socket) {
  socket.id = idTracker;
  socketList[socket.id] = socket;
  currSocket = socket;
  socket.emit("giveID", socket.id);
  socket.pos = { x: 0, y: 240 };
  idTracker++;
  console.log("Client connected...");
  console.log("Client id is: " + socket.id);
  console.log("IP address is: " + socket.request.connection.remoteAddress);

  socket.on("join", function (data) {
    console.log("Received join message from client");
  });

  socket.on("disconnect", function(){
    console.log("disconnected!");
    delete(socket.pos);
    delete(currSocket);
    delete(socketList[currSocket]);
    delete(socket.id);


});
  socket.on("updatePos", function (data) {
    // console.log("receiving updatepos message");
    socketList[data.id].pos.y -= data.delta;
    socketList[data.id].pos.x += data.alpha;
    //console.log(socketList[data.id].pos.y);
    console.log(socketList[data.id].pos.x);
  });
});

setInterval(function () {
  let playerPositions = {};
  for (let key in socketList) {
    playerPositions[key] = socketList[key].pos;
  }

  for (let key in socketList) {
    socketList[key].emit("update", playerPositions);
  }

  // if (currSocket) {
  //   console.log("curr socket exists");
  //   currSocket.emit("update", playerPositions);
  // }
}, 1000 / 30);

server.listen(process.env.PORT || 3000);
