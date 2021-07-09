const chatController = require('../controller/chatController');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', (messageData) => {
      const formatedMessage = chatController.formatMessage(messageData);
      console.log(formatedMessage);
      io.emit('message', formatedMessage);
    });
  });
};