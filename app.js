// app.js
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

app.use(express.static(__dirname + "/client"));
app.get("/", function(req, res, next) {
    res.sendFile(__dirname + "/client/index.html");
});

let idTracker = 0;

io.on("connection", function(socket) {
    socket.id = idTracker;
    idTracker++;
    console.log("Client connected...");
    console.log("Client id is: " + socket.id);
    console.log("IP address is: " + socket.request.connection.remoteAddress);

    socket.on("join", function(data) {
        console.log("Received join message from client");
    });
});

server.listen(process.env.PORT || 3000);
