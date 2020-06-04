function clickage(color) {
  if (color == "blue") {
    console.log("BLUE TEAM");
    socket.emit("teamChoice", { id: id, team: "TEAM_2" });
  }
  if (color == "red") {
    console.log("RED TEAM");
    socket.emit("teamChoice", { id: id, team: "TEAM_1" });
  }
  console.log("Button pushed!");
  $("#team-choice-wrapper").addClass("hidden");
  $("#game-canvas-wrapper").removeClass("hidden");
}
