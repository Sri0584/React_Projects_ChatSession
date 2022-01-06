const express = require("express");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");

app.use(express.static("public"));
app.use(cors());

io.on("connection", function (socket) {
  console.log("user connected!!");
  socket.on("newuser", (username) => {
    socket.broadcast.emit("update", username + "Joined the conversation");
  });

  socket.on("exituser", (username) => {
    socket.broadcast.emit("update", username + "left the conversation");
  });

  socket.on("chat", (message) => {
    socket.broadcast.emit("chat", message);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(5000, () => {
  console.log("listening on *:5000");
});
// https://www.youtube.com/watch?v=ZwFA3YMfkoc
