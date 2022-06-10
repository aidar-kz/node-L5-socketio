const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap"));
app.use("/m-icons", express.static(__dirname + "/node_modules/material-icons"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client.html");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Сервер слушает порт ${port}`);
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("Неправильное имя пользователя"));
  }
  socket.username = username;
  next();
});

let users = [];

io.on("connection", (socket) => {
  console.log(`Пользователь ${socket.username} подключился.`);
  users.push(socket.username);
  io.emit("users", users);

  socket.broadcast.emit("connection", socket.username);

  socket.on("disconnect", () => {
    console.log(`Пользователь ${socket.username} отключился.`);
    socket.broadcast.emit("disconnection", socket.username);
    users = users.filter((user) => user !== socket.username);
    io.emit("users", users);
  });

  socket.on("typing", (name) => {
    socket.broadcast.emit("typing", socket.username);
  });

  socket.on("not typing", (name) => {
    socket.broadcast.emit("not typing", socket.username);
  });

  socket.on("chat message", (msg) => {
    console.log("Новое сообщение:", msg);
    socket.broadcast.emit("chat message", { sender: socket.username, content: msg });
  });
});
