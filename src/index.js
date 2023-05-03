const path = require("path");
const { createServer } = require("http");

const express = require("express");
const app = express();

// settings
// app.set("port", process.env.PORT || 3000);
// const server = app.listen(app.get("port"), () => {
//   console.log("server on port", app.get("port"));
// });

// const SocketIo = require("socket.io");

// const io = SocketIo(server);
// // websocket
// io.on("connection", socket => {
//   console.log("new connection", socket.id);
// });

// --------------------------------
app.use("/", express.static(path.join(__dirname, "static")));

const { getIO, initIO } = require("./socket");
const httpServer = createServer(app);

let port = process.env.PORT || 3000;

initIO(httpServer);

httpServer.listen(port);
console.log("Server started on ", port);

getIO();
