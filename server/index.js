const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const router = require("./router");
require("dotenv").config();

app.use(cors());

app.use(router);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chaty-application.herokuapp.com/",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);
