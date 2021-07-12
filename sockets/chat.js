module.exports = (io) => io.on('connection', (socket) => {
  socket.on('message', (message) => {
    const date = new Date().toLocaleString('pt-br').replace(/\//g, '-');
    io.emit('serverMessage', `${date} ${message.nickname}: ${message.chatMessage}`);
  });
});
