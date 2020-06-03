var socket = io();

let id;
let playerPositions;
let movingUp = false;
let movingDown = false;
let movingLeft = false;
let movingRight = false;

socket.on("connect", function (data) {
  socket.emit("join");

  console.log("Whoooo we connected");
});

socket.on("giveID", function (data) {
  id = data;
  console.log("Given id is: " + id);
});
socket.on("updatePlayers", function (data) {
  console.log("receive update");
  playerPositions = data;
});

/**
 * Game Stuff
 */
function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("game-canvas-wrapper");

  ellipseMode(CENTER);
}

function draw() {
  background(255);
  fill(0);
  drawBasketballCourt();
  if (playerPositions) {
    for (let key in playerPositions) {
      rect(playerPositions[key].x, playerPositions[key].y, 20, 20);
    }
  }

  if (movingUp) {
    socket.emit("updatePos", { id: id, delta: 4, alpha: 0 });
  }
  if (movingDown) {
    socket.emit("updatePos", { id: id, delta: -4, alpha: 0 });
  }
  if (movingLeft) {
    socket.emit("updatePos", { id: id, delta: 0, alpha: -4});
  }
  if (movingRight) {
    socket.emit("updatePos", { id: id, delta: 0, alpha: 4});
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
  if (keyCode == 65) {
    movingLeft = true;
  }
  if (keyCode == 68) {
    movingRight = true;
  }
}

function keyReleased() {
  if (keyCode == 87) {
    movingUp = false;
  }
  if (keyCode == 83) {
    movingDown = false;
  }
  if (keyCode == 65) {
    movingLeft = false;
  }
  if (keyCode == 68) {
    movingRight = false;
  }
}
