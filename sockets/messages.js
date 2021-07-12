const messageModel = require('../models/messagesModel');
const { formatDate } = require('../services/formatDate');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', async ({ chatMessage, nickname }) => {
      const timestamp = formatDate(new Date(Date.now()));
      await messageModel.createMessage(timestamp, nickname, chatMessage);
      const message = `${timestamp} - ${nickname}: ${chatMessage}`;
      console.log(message, 'message');
      io.emit('message', message);
    });

    socket.on('getMessagesHistory', async () => {
      const messages = await messageModel.getMessage();
      console.log(messages, 'messagesArray');
      socket.emit('messageHistory', messages);
    });
  });
};
