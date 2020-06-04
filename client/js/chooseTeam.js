
function clickage(color) {
  if (color == 'blue') {
    console.log("BLUE TEAM");
    socket.emit("teamChoice", "TEAM_1");
  }
  if (color == 'red') {
    console.log("RED TEAM");
    socket.emit("teamChoice", "TEAM_2");
  }
  console.log("Button pushed!");
  $("#team-choice-wrapper").addClass("hidden");
  $("#game-canvas-wrapper").removeClass("hidden");


};
