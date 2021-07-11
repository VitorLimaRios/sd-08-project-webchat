const getDate = require('../public/utils/getDate');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // socket.emit('serverMessage', `Olá, seja bem vindo ao chat ID: ${socket.id}`);
    socket.on('message', ({ chatMessage, nickname }) => {
      io.emit('serverMessage', `${getDate()} - ${nickname}: ${chatMessage}`);
    });
    socket.on('disconnect', () => {
      socket.broadcast.emit('serverMessage', 'Cliente disconectado.');
    });
  });
};
