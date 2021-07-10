const ChatController = require('../controller/chatController');
const ChatModel = require('../models/chatModel');

const formatSavedMessage = ({ timestamp, nickname, message }) =>
  `${timestamp} - ${nickname}: ${message}`;

module.exports = (io) => {
  io.on('connection', async (socket) => {
    const allMessages = await ChatModel.getAllMessages();
    const allFormatedMessages = allMessages.map(formatSavedMessage);
    socket.emit('sessionStart', allFormatedMessages);

    socket.on('message', async (messageData) => {
      const formatedMessage = await ChatController.formatMessage(messageData);
      io.emit('message', formatedMessage);
    });
  });
};
