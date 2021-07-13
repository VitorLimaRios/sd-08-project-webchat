module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('aLoggedInUser', () => {
      console.log(`Usúario logou -> ${socket.id}`);
    });
    socket.on('message', (data) => {
      socket.broadcast.emit('message', data);
    });
  });
};
