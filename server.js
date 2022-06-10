const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client.html");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Сервер слушает порт ${port}`);
});

io.on("connection", (socket) => {
  console.log(`Пользователь с ID ${socket.id} подключился.`);

  socket.broadcast.emit("connection", socket.id);

  socket.on("disconnect", () => {
    console.log(`Пользователь с ID ${socket.id} отключился.`);
    socket.broadcast.emit("disconnection", socket.id);
  });

  socket.on("chat message", (msg) => {
    console.log("Новое сообщение:", msg);
    io.emit("chat message", msg);
  });
});
