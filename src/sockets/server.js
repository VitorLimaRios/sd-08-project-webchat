module.exports = (io) => {
  io.on('connect', (socket) => {
    socket.emit('welcome', 'new user connect');  
  });
};