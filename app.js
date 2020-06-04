// app.js
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
<<<<<<< HEAD
=======
var Game = require("./js/Game");
>>>>>>> master
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
<<<<<<< HEAD
let currSocket;
=======
var games = {};
games[1] = new Game();
>>>>>>> master

io.on("connection", function (socket) {
  var player = {};

  player.id = idTracker;
  //game.prototype.addPlayer(player);

  socket.id = idTracker;
  socketList[socket.id] = socket;
  currSocket = socket;
  socket.emit("giveID", socket.id);
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
<<<<<<< HEAD
     console.log("receiving updatepos message");
    // game.movePlayer(data)
    socketList[data.id].pos.y -= data.delta;
    socketList[data.id].pos.x += data.alpha;
    console.log(socketList[data.id].pos.y);
    console.log(socketList[data.id].pos.x);
=======
    games[socket.gameID].updatePlayer(data.id, data.dx, data.dy);
  });
  socket.on("updateAngle", function (data) {
    games[socket.gameID].updatePlayerAngle(data.id, data.angle);
>>>>>>> master
  });

  socket.on("initials", function (data) {
    // TODO associate initials with player object
    socket.initials = data;
    console.log("Received player initials: " + socket.initials);

});




// Main Game
// Create the necessary game attributes
// var ball = new Basketball();
var hoops = [];
// hoops.push(new Hoop());
// hoops.push(new Hoop());
var PLAYER_SIZE = 20;

setInterval(function () {
<<<<<<< HEAD
  let playerPositions = {};
  for (let key in socketList) {
    playerPositions[key] = socketList[key].pos;
  }

  for (let key in socketList) {
    // Assume the background and the hoops are static and drawn automatically on player side
    socketList[key].emit("updatePlayers", playerPositions);
    // socketList[key].emit("updateBall", ball);
  }

  // Collisions
  // Player vs. Player
  // for (key1 in Object.keys(playerPositions)) {
  //   for (key2 in Object.keys(playerPositions)) {
  //     if (key1 == key2) {
  //       continue;
  //     } else {
  //       let player1 = playerPositions[key1];
  //       let player2 = playerPositions[key2];
  //       if (
  //         collideCircleCircle(
  //           player1.x,
  //           player1.y,
  //           PLAYER_SIZE,
  //           player2.x,
  //           player.y,
  //           PLAYER_SIZE
  //         )
  //       ) {
  //         // Player should be blocked from moving
  //       }
  //     }
  //   }
  // }

  // Player vs. Ball
  // for (key in Object.keys(playerPositions)) {
  //   let player = playerPositions[key];
  //   if (
  //     collideCircleCircle(
  //       ball.x,
  //       ball.y,
  //       ball.size,
  //       player.x,
  //       player.y,
  //       PLAYER_SIZE
  //     )
  //   ) {
  //     ball.caught(player);
  //   }
  // }
  //

  // // Ball vs. Hoop
  // for (hoop in hoops) {
  //   if (
  //     collideRectCircle(
  //       hoop.x,
  //       hoop.y,
  //       hoop.width,
  //       hoop.length,
  //       ball.x,
  //       ball.y,
  //       ball.size
  //     )
  //   ) {
  //     hoop.score();
  //   }
  // }
}, 1000 / 30);
=======
  let key;
  for (key of Object.keys(games)) {
    game = games[key];
    game.update();
    // Emit update to players
    let newData = game.draw();
    let player;
    for (player of game.getPlayers()) {
      socketList[player].emit("drawData", newData);
      socketList[player].emit("updateScore", {
        team1Score: game.score["Team 1"],
        team2Score: game.score["Team 2"],
      });
    }
  }
  1000 / 30;
});
>>>>>>> master

server.listen(process.env.PORT || 3000);
