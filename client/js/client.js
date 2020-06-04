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
let holdingThrow = false;
let throwPower = 0;
let hasBall = false;
let stamina = MAX_STAMINA;
let playerPosX = 0;
let playerPosY = 0;
let team1Score = 0;
let team2Score = 0;
let toDraw = {};
let gameOver = false;
let winner;

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
  team1Score = data.team1Score;
  team2Score = data.team2Score;
});

socket.on("drawData", function (data) {
  toDraw = data;
});

socket.on("winReceiver", function (team) {
  this.restarter(team);
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

  updateAngleIndicator();
  drawPlayers();
  drawStaminaBar();
  drawScore();
  handleMovement();
  if (gameOver) {
    this.drawWin();
  }
}

function updateAngleIndicator() {
  if (holdingThrow) {
    throwPower += (MAX_THROW_POWER - throwPower) / 10;
  } else {
    if (throwPower > 0) {
      throwPower--;
    }
  }
}

function drawPlayers() {
  noStroke();
  for (let key of Object.keys(toDraw)) {
    let obj = toDraw[key];
    fill(obj.fillColor.r, obj.fillColor.g, obj.fillColor.b);
    if (obj.id == -1) {
      // basketball
      strokeWeight(1);
      stroke(0);
      if (obj.angle) {
        let offset = createVector(8 * cos(obj.angle), 8 * sin(obj.angle));
        offset.rotate(30 * (PI / 180));
        circle(obj.pos.x + offset.x, obj.pos.y + offset.y, obj.size);
      } else {
        circle(obj.pos.x, obj.pos.y, obj.size);
      }

      if (obj.playerID && obj.playerID == id) {
        hasBall = true;
      } else {
        hasBall = false;
      }
    } else {
      noStroke();
      circle(obj.pos.x, obj.pos.y, obj.size);
    }

    if (obj.id == id) {
      playerPosX = obj.pos.x;
      playerPosY = obj.pos.y;
      let offset = createVector(mouseX - playerPosX, mouseY - playerPosY);
      let angle = atan2(offset.y, offset.x);
      drawAngleIndicator(
        createVector(playerPosX, playerPosY),
        angle,
        throwPower
      );
      // also update the server with offset
      socket.emit("updateAngle", { id: id, angle: angle });
      socket.emit("updateThrowPower", { id: id, power: throwPower });

      fill(0, 255, 0);
      textSize(16);
      text(obj.initials, obj.pos.x - 10, obj.pos.y - 20);
    } else if (obj.id != -1) {
      let angle = obj.angle;
      if (angle) {
        drawAngleIndicator(
          createVector(obj.pos.x, obj.pos.y),
          angle,
          obj.throwPower
        );
      }
      fill(0);
      textSize(16);
      text(obj.initials, obj.pos.x - 10, obj.pos.y - 20);
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

function handleMovement() {
  if (!holdingThrow) {
    if (movingUp) {
      socket.emit("updatePos", { id: id, dx: 0, dy: -playerSpeed });
    }
    if (movingDown) {
      socket.emit("updatePos", { id: id, dx: 0, dy: playerSpeed });
    }
    if (movingLeft) {
      socket.emit("updatePos", { id: id, dx: -playerSpeed, dy: 0 });
    }
    if (movingRight) {
      socket.emit("updatePos", { id: id, dx: playerSpeed, dy: 0 });
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

function drawAngleIndicator(pos, angle, throwPower) {
  let offset = createVector(
    (ANGLE_INDICATOR_LENGTH + throwPower) * cos(angle),
    (ANGLE_INDICATOR_LENGTH + throwPower) * sin(angle)
  );
  let offsetPos = createVector(pos.x + offset.x, pos.y + offset.y);
  let offsetLeft = createVector(offset.x, offset.y);
  let offsetRight = createVector(offset.x, offset.y);
  offsetLeft = offsetLeft
    .rotate(PI - PI / 6)
    .setMag(ANGLE_INDICATOR_ARROW_LENGTH);
  offsetRight = offsetRight
    .rotate(PI + PI / 6)
    .setMag(ANGLE_INDICATOR_ARROW_LENGTH);
  // let offsetPosLeft = createVector(
  //   pos.x + (ANGLE_INDICATOR_LENGTH + throwPower - 4) * cos(leftAngle),
  //   pos.y + (ANGLE_INDICATOR_LENGTH + throwPower - 4) * sin(leftAngle)
  // );
  let offsetPosLeft = createVector(
    offsetPos.x + offsetLeft.x,
    offsetPos.y + offsetLeft.y
  );
  // let offsetPosRight = createVector(
  //   pos.x + (ANGLE_INDICATOR_LENGTH + throwPower - 4) * cos(rightAngle),
  //   pos.y + (ANGLE_INDICATOR_LENGTH + throwPower - 4) * sin(rightAngle)
  // );
  let offsetPosRight = createVector(
    offsetPos.x + offsetRight.x,
    offsetPos.y + offsetRight.y
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
  text("Red: " + team1Score, 5, 30);
  text("Blue: " + team2Score, 350, 30);
}

function drawWin() {
  textSize(32);
  fill(0, 102, 0);
  text("The " + winner + " team is the winner!", 44, 120);
  text("Press R to restart", 100, 360);
}

function keyPressed() {
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
  if (keyCode == 75) {
    this.restarter("blue");
    //socket.emit("autowin");
  }
  if (keyCode == 82 && gameOver) {
    gameOver = false;
    socket.emit("restartGame", this.id);
    this.draw();
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

function restarter(color) {
  console.log("im happening!");
  gameOver = true;
  winner = color;
}

function mousePressed() {
  // TODO check that the ball is in this player's position, otherwise they can't throw lol
  if (hasBall) {
    holdingThrow = true;
  }
}

function mouseReleased() {
  holdingThrow = false;
}
