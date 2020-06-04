function clickage(color) {
<<<<<<< HEAD
  if (color == 'red') {
    console.log("RED TEAM");
    socket.emit("teamChoice", 'red');
  }
  if (color == 'blue') {
    console.log("BLUE TEAM");
    socket.emit("teamChoice", 'blue');
=======
  if (color == "blue") {
    console.log("BLUE TEAM");
    socket.emit("teamChoice", { id: id, team: "TEAM_2" });
  }
  if (color == "red") {
    console.log("RED TEAM");
    socket.emit("teamChoice", { id: id, team: "TEAM_1" });
>>>>>>> master
  }
  console.log("Button pushed!");
  $("#team-choice-wrapper").addClass("hidden");
  $("#game-canvas-wrapper").removeClass("hidden");
}
