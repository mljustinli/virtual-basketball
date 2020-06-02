var socket = io();

socket.on("connect", function (data) {
  socket.emit("join");
});
