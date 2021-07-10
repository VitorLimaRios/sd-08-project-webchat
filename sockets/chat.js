const moment = require('moment');

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const newMessage = { nickname, message: chatMessage, timestamp: Date.now() };
    io.emit('message', `${moment(newMessage.timestamp)
      .format('DD-MM-YYYY HH:mm:ss')} - ${newMessage.nickname}: ${newMessage.message}`);
  });
});
