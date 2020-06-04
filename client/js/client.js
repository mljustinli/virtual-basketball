var socket = io();

let id;
let playerPositions;
let playerAngles;
let playerSpeed = PLAYER_SPEED;
let movingUp = false;
let movingDown = false;
let movingLeft = false;
let movingRight = false;
let holdingShift = false;
let stamina = MAX_STAMINA;
let playerPosX = 0;
let playerPosY = 0;
let redScore = 0;
let blueScore = 0;

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
socket.on("updateAngles", function (data) {
  playerAngles = data;
});
socket.on("updateScore", function (data) {
  redScore = data.redScore;
  blueScore = data.blueScore;
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
  drawPlayers();
  drawStaminaBar();
  drawScore();
  handleMovement();
}

function drawPlayers() {
  if (playerPositions) {
    for (let key in playerPositions) {
      if (key == id) {
        playerPosX = playerPositions[key].x;
        playerPosY = playerPositions[key].y;
        let offset = createVector(mouseX - playerPosX, mouseY - playerPosY);
        let angle = atan2(offset.y, offset.x);
        drawAngleIndicator(
          createVector(playerPositions[key].x, playerPositions[key].y),
          angle
        );
        // also update the server with offset
        socket.emit("updateAngle", { id: id, angle: angle });
      } else {
        let angle = playerAngles[key];
        if (angle) {
          drawAngleIndicator(
            createVector(playerPositions[key].x, playerPositions[key].y),
            angle
          );
        }
      }
      fill(30, 96, 189);
      ellipse(playerPositions[key].x, playerPositions[key].y, 20, 20);
    }
  }
}

function handleMovement() {
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
    stamina -= 2;
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

function drawStaminaBar() {
  // draw stamina bar
  stroke(255);
  fill(230, 165, 46);
  strokeWeight(3);
  rect(20, height - 50, 80, 20);
  noStroke();
  fill(255);
  rect(20 + 3, height - 50 + 3, 74 * (stamina / MAX_STAMINA), 14);
}

function drawAngleIndicator(pos, angle) {
  let leftAngle = angle + 15 * (PI / 180);
  let rightAngle = angle - 15 * (PI / 180);
  let offsetPos = createVector(
    pos.x + ANGLE_INDICATOR_LENGTH * cos(angle),
    pos.y + ANGLE_INDICATOR_LENGTH * sin(angle)
  );
  let offsetPosLeft = createVector(
    pos.x + (ANGLE_INDICATOR_LENGTH - 4) * cos(leftAngle),
    pos.y + (ANGLE_INDICATOR_LENGTH - 4) * sin(leftAngle)
  );
  let offsetPosRight = createVector(
    pos.x + (ANGLE_INDICATOR_LENGTH - 4) * cos(rightAngle),
    pos.y + (ANGLE_INDICATOR_LENGTH - 4) * sin(rightAngle)
  );
  strokeWeight(3);
  stroke(255, 0, 0);
  line(pos.x, pos.y, offsetPos.x, offsetPos.y);
  fill(255, 0, 0);
  noStroke();
  triangle(
    offsetPos.x,
    offsetPos.y,
    offsetPosLeft.x,
    offsetPosLeft.y,
    offsetPosRight.x,
    offsetPosRight.y
  );
}

function drawScore() {
  textSize(32);
  text("Red: " + redScore, 5, 30);
  text("Blue: " + blueScore, 350, 30);
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
