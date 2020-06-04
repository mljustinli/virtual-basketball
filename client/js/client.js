var socket = io();
var id;
var playerSpeed = PLAYER_SPEED;
var movingUp = false;
var movingDown = false;
var movingLeft = false;
var movingRight = false;
var holdingShift = false;
var stamina = MAX_STAMINA;
var ball;
var toDraw = {};

socket.on("giveID", function (data) {
  id = data;
  console.log("Given id is: " + id);
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

  noStroke();
  for (let key of Object.keys(toDraw)) {
      let obj = toDraw[key];
      fill(obj.fillColor.r, obj.fillColor.g, obj.fillColor.b);
      circle(obj.pos.x, obj.pos.y, obj.size);
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
    stamina-=2;
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
