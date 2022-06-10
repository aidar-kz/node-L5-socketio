const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("<h1>Привет от сервера!</h1>");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Сервер слушает порт ${port}`);
});
