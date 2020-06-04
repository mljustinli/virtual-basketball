var button = $("#team-choice-red");

function clickage(color) {
  if (color == 'red') {
    console.log("RED TEAM");
    socket.emit("teamChoice", 'red');
  }
  if (color == 'blue') {
    console.log("BLUE TEAM");
    socket.emit("teamChoice", 'blue');
  }
  console.log("Button pushed!");
  $("#team-choice-wrapper").addClass("hidden");
  $("#game-canvas-wrapper").removeClass("hidden");
};
