function createRealtime(io) {
  return {
    notifyUser(userId, event, payload) {
      io.to(`user:${userId}`).emit(event, payload);
    },
  };
}

module.exports = createRealtime;