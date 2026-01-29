const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user.id}`);

    socket.on("disconnect", () => {
      console.log(`User ${socket.user.id} disconnected`);
    });
  });

  return io;
}

function socketAuth(io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("NO_TOKEN"));

      const payload = jwt.verify(token, process.env.JWT_SECRET);

      const userId = payload.id ?? payload.userId ?? payload.sub;
      if (!userId) return next(new Error("TOKEN_NO_USER_ID"));

      socket.user = { id: userId };
      next();
    } catch (err) {
      next(new Error("INVALID_TOKEN"));
    }
  });
};

function createRealtime(io) {
  return {
    notifyUser(userId, event, payload) {
      io.to(`user:${userId}`).emit(event, payload);
    },
  };
}

module.exports = { initSocket, socketAuth, createRealtime };