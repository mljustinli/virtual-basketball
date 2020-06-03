var socket = io();

let id;
let playerPositions;
let movingUp = false;
let movingDown = false;

socket.on("connect", function (data) {
  socket.emit("join");

  console.log("Whoooo we connected");
});

socket.on("giveID", function (data) {
  id = data;
  console.log("Given id is: " + id);
});

socket.on("update", function (data) {
  console.log("receive update");
  playerPositions = data;
});

/**
 * Game Stuff
 */

function setup() {
  createCanvas(480, 480);
  ellipseMode(CENTER);
}

function draw() {
  background(255);
  fill(0);
  if (playerPositions) {
    for (let key in playerPositions) {
      rect(playerPositions[key].x, playerPositions[key].y, 20, 20);
    }
  }

  if (movingUp) {
    socket.emit("updatePos", { id: id, delta: 4 });
  }
  if (movingDown) {
    socket.emit("updatePos", { id: id, delta: -4 });
  }
}

function keyPressed() {
  console.log(keyCode);

  if (keyCode == 87) {
    movingUp = true;
  }
  if (keyCode == 83) {
    movingDown = true;
  }
}

function keyReleased() {
  if (keyCode == 87) {
    movingUp = false;
  }
  if (keyCode == 83) {
    movingDown = false;
  }
}
