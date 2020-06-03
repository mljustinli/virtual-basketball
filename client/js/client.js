var socket = io();

socket.on("connect", function (data) {
  socket.emit("join");
});

function setup() {
  let canvas = createCanvas(480, 640);
  canvas.parent("game-canvas-wrapper");
}

function draw() {
  background(255);
  fill(0);

  drawBasketballCourt();
}

function keyPressed() {
  console.log("Key pressed: " + keyCode);
}

function keyReleased() {}

function drawBasketballCourt() {}
