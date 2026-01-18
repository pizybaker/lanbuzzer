const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let locked = false;

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("buzz", (name) => {
    if (!locked) {
      locked = true;
      io.emit("winner", name);
    }
  });

  socket.on("reset", () => {
    locked = false;
    io.emit("reset");
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
