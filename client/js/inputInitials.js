var input = $("#initials-input");

$(document).ready(function () {
  input.keypress(function (event) {
    if (event.keyCode == 13) {
      let initials = input.val();
      console.log("Initials are: " + initials);
      event.preventDefault();

      // send server the initials
      socket.emit("initials", initials);

      // hide the input and show the list of games/game
      $("#initials-input-wrapper").addClass("hidden");
      $("#team-choice-wrapper").removeClass("hidden");
    }
  });

  if (!promptForInitials) {
    // send server the initials
    socket.emit("initials", "AA");

    // hide the input and show the list of games/game
    $("#initials-input-wrapper").addClass("hidden");
    $("#team-choice-wrapper").removeClass("hidden");
  }
});
