const messageModel = require('../models/messagesModel');
const { formatDate } = require('../services/formatDate');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', async ({ chatMessage, nickname }) => {
      const date = formatDate(new Date(Date.now()));
      await messageModel.createMessage(date, nickname, chatMessage);
      const message = `${date} - ${nickname}: ${chatMessage}`;
      io.emit('message', message);
    });

    socket.on('getMessagesHistory', async () => {
      const messages = await messageModel.getMessage();

      socket.emit('messageHistory', messages);
    });
  });
};
