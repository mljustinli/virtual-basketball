// app.js
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var Basketball = require("./Baketball");

var LOGGING = true;
function log(str){
  if(LOGGING) {
    console.log(str)
  }
}

app.use(express.static(__dirname + "/client"));
app.get("/", function (req, res, next) {
  res.sendFile(__dirname + "/client/index.html");
});

let idTracker = 0;

let socketList = {};
let currSocket;

io.on("connection", function (socket) {
  socket.id = idTracker;
  idTracker++;
  socketList[socket.id] = socket;
  currSocket = socket;
  socket.emit("giveID", socket.id);
  socket.pos = { x: 0, y: 240 };
  log("Client connected...");
  log("Client id is: " + socket.id);
  log("IP address is: " + socket.request.connection.remoteAddress);

  socket.on("updateY", function (data) {
    // console.log("receiving updatepos message");
    socketList[data.id].pos.y -= data.delta;
    log(socketList[data.id].pos.y);
  });

  socket.on("updateX", function (data) {
    // console.log("receiving updatepos message");
    socketList[data.id].pos.x -= data.delta;
    log(socketList[data.id].pos.x);
  });

});






// Main Game
// Create the necessary game attributes
var ball = new Basketball();
var hoops = [];
hoops.push(new Hoop());
hoops.push(new Hoop());
var PLAYER_SIZE = 2;

setInterval(function () {
  let playerPositions = {};
  for (let key in socketList) {
    playerPositions[key] = socketList[key].pos;
  }

  for (let key in socketList) {
    socketList[key].emit("update", playerPositions);
  }

  // Collisions
  // Player vs. Player
  for(player1 in playerPositions) {
    for(player2 in playerPositions) {
        if(player1 == player2) {
          continue;
        }
        else {
          if(collideCircleCircle(player1.pos.x, player1.pos.y, PLAYER_SIZE, player2.pos.x, player.pos.y, PLAYER_SIZE)) {
              // Player should be blocked from moving
          }
        }
    }
  }

  // Player vs. Ball
  for(player in playerPositions) {
    if(collideCircleCircle(ball.x, ball.y, ball.size, player2.pos.x, player.pos.y, PLAYER_SIZE)) {
      ball.caught(player);
    }
  }

  // Ball vs. Hoop
  for(hoop in hoops) {
    if(collideRectCircle(hoop.x, hoop.y, hoop.width, hoop.length, ball.x, ball.y, ball.size)) {
      hoop.score();
    }
  }

}, 1000 / 30);

server.listen(process.env.PORT || 3000);
