module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.emit('serverMessage', 'Bem vindo ao chat');
    console.log(socket.id);
  });
};