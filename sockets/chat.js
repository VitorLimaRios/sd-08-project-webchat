const { getChatHour } = require('../utils/service');

module.exports = (io) => io.on('connection', (socket) => {
  // console.log(`Usuario com ID ${socket.id}.`);
  const socketId = socket.id;

  socket.broadcast.emit('newUser', socketId);

  socket.on('message', (data) => {
    const { chatMessage, nickname } = data;
    const initialNickName = nickname || socketId.substring(0, 16);
    console.log('Sockets', data);
    const chatHour = getChatHour();

    const chatMessageComplete = `${chatHour} ${initialNickName} ${chatMessage}`;
    io.emit('message', chatMessageComplete);
  });
});
