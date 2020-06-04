var button = $("#team-choice-red");

function clickage(color) {
  if (color == 'red') {
    console.log("RED TEAM");
  }
  if (color == 'blue') {
    console.log("BLUE TEAM");
  }
  console.log("Button pushed!");
  $("#team-choice-wrapper").addClass("hidden");
  $("#game-canvas-wrapper").removeClass("hidden");
};
