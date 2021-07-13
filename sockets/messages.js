const messageModel = require('../models/messagesModel');
const { formatDate } = require('../services/formatDate');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', async ({ chatMessage, nickname }) => {
      const timestamp = formatDate(new Date(Date.now()));
      const message = `${timestamp} - ${nickname}: ${chatMessage}`;
      io.emit('message', message);
      await messageModel.createMessage(timestamp, nickname, chatMessage);
    });

    socket.on('getMessagesHistory', async () => {
      const messagesData = await messageModel.getMessage();
      const messages = messagesData.map((msg) =>
        (`${msg.timestamp} - ${msg.nickname}: ${msg.chatMessage}`));
      socket.emit('messageHistory', messages);
    });
  });
};
