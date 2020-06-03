var socket = io();

socket.on("connect", function (data) {
  socket.emit("join");
});

function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("game-canvas-wrapper");

  ellipseMode(CENTER);
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
