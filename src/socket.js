const { Server } = require("socket.io");
let IO;

module.exports.initIO = httpServer => {
  IO = new Server(httpServer);

  IO.use((socket, next) => {
    if (socket.handshake.query) {
      let callerId = socket.handshake.query.callerId;
      socket.user = callerId;
      next();
    }
  });

  IO.on("connection", socket => {
    console.log(socket.user, "Connected");
    socket.join(socket.user);

    socket.on("call", data => {
      console.log("calling");
      let callerId = data.callerId;
      let rtcMessage = data.rtcMessage;

      socket.to(callerId).emit("newCall", {
        callerId: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("answerCall", data => {
      let callerId = data.callerId;
      rtcMessage = data.rtcMessage;

      socket.to(callerId).emit("callAnswered", {
        callee: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("ICEcandidate", data => {
      console.log("ICEcandidate data.callerId", data.callerId);
      let callerId = data.callerId;
      let rtcMessage = data.rtcMessage;

      socket.to(callerId).emit("ICEcandidate", {
        sender: socket.user,
        rtcMessage: rtcMessage,
      });
    });
  });
};

module.exports.getIO = () => {
  if (!IO) {
    throw Error("IO not initilized.");
  } else {
    return IO;
  }
};
