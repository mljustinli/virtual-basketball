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
let team1Score = 0;
let team2Score = 0;
let toDraw = {};
let leftMouseClicked = false;

socket.on("connect", function (data) {
  socket.emit("join");
  console.log("Whoooo we connected");
});

socket.on("giveID", function (data) {
  id = data;
  console.log("Given id is: " + id);
});
socket.on("updateScore", function (data) {
  team1Score = data.team1Score;
  team2Score = data.team2Score;
});

socket.on("drawData", function (data) {
  toDraw = data;
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

  drawPlayers();
  drawStaminaBar();
  drawScore();
  handleMovement();
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
    } else {
      noStroke();
      circle(obj.pos.x, obj.pos.y, obj.size);
    }

    if (obj.id == id) {
      playerPosX = obj.pos.x;
      playerPosY = obj.pos.y;
      let offset = createVector(mouseX - playerPosX, mouseY - playerPosY);
      let angle = atan2(offset.y, offset.x);
      drawAngleIndicator(createVector(playerPosX, playerPosY), angle);
      // also update the server with offset
      socket.emit("updateAngle", { id: id, angle: angle });

      fill(0, 255, 0);
      textSize(16);
      if (obj.initials) {
        console.log("yay");
      }
      text(obj.initials, obj.pos.x - 10, obj.pos.y - 20);
    } else if (obj.id != -1) {
      let angle = obj.angle;
      if (angle) {
        drawAngleIndicator(createVector(obj.pos.x, obj.pos.y), angle);
      }
      fill(0);
      textSize(16);
      text(obj.initials, obj.pos.x - 10, obj.pos.y - 20);
    }
  }
  // drawPlayers();
  drawStaminaBar();
  drawScore();
  handleMovement();
  if (leftMouseClicked) {
    socket.emit("leftMouseClick", {id: id});
    leftMouseClicked = false;
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
  text("Red: " + team1Score, 5, 30);
  text("Blue: " + team2Score, 350, 30);
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

function mouseClicked() {
  if(mouseButton === LEFT){
    leftMouseClicked = true;
  }
}
