const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

app.use("/bootstrap", expres.static(__dirname + "/node_modules/bootstrap"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client.html");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Сервер слушает порт ${port}`);
});
