var socket = io();

let id;
let playerPositions;
let playerSpeed = PLAYER_SPEED;
let movingUp = false;
let movingDown = false;
let movingLeft = false;
let movingRight = false;
let holdingShift = false;
let stamina = MAX_STAMINA;

socket.on("connect", function (data) {
  socket.emit("join");

  console.log("Whoooo we connected");
});

socket.on("giveID", function (data) {
  id = data;
  console.log("Given id is: " + id);
});
socket.on("updatePlayers", function (data) {
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
  drawBasketballCourt();

  noStroke();
  fill(30, 96, 189);
  if (playerPositions) {
    for (let key in playerPositions) {
      ellipse(playerPositions[key].x, playerPositions[key].y, 20, 20);
    }
  }

  // draw stamina bar
  stroke(255);
  fill(230, 165, 46)
  strokeWeight(3);
  rect(20, height - 50, 80, 20);
  noStroke();
  fill(255);
  rect(20 + 3, height - 50 + 3, 74 * (stamina / MAX_STAMINA), 14);

  if (movingUp) {
    socket.emit("updatePos", { id: id, dx: playerSpeed, dy: 0 });
  }
  if (movingDown) {
    socket.emit("updatePos", { id: id, dx: -playerSpeed, dy: 0 });
  }
  if (movingLeft) {
    socket.emit("updatePos", { id: id, dx: 0, dy: -playerSpeed });
  }
  if (movingRight) {
    socket.emit("updatePos", { id: id, dx: 0, dy: playerSpeed });
  }
  if (holdingShift && (movingUp || movingDown || movingLeft || movingRight)) {
    stamina--;
    if (stamina <= 0) {
      playerSpeed = PLAYER_SPEED;
      stamina = 0;
    }
  } else {
    if (stamina < MAX_STAMINA) {
      stamina++;
    }
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
  if (keyCode == 16) {
    holdingShift = true;
    playerSpeed = PLAYER_FAST_SPEED;
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
  if (keyCode == 16) {
    holdingShift = false;
    playerSpeed = PLAYER_SPEED;
  }
}
