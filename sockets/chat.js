module.exports = (io) => io.on('connection', (socket) => {
  socket.on('message', (data) => {
    const date = new Date();
    const dateFormat = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    const hourFormat = `${date.getHours()}:${date.getMinutes()}`;
    const message = `${dateFormat} ${hourFormat} - ${data.nickname}: ${data.chatMessage}`;
    io.emit('message', message);
  });
});
