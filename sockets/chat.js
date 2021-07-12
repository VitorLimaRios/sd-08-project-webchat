const moment = require('moment');
const Model = require('../models/chatModel');

module.exports = (io) => io.on('connection', async (socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const newMessage = { nickname, message: chatMessage, timestamp: Date.now() };
    io.emit('message', `${moment(newMessage.timestamp)
      .format('DD-MM-YYYY HH:mm:ss')} - ${newMessage.nickname}: ${newMessage.message}`);
    const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');
    await Model.postChatMessage({ message: chatMessage, nickname, timestamp });
  });
  const userLoggedIn = async () => {
    const data = await Model.getChatMessages();
    const formatData = await data.map(
      (element) => `${element.timestamp} - ${element.nickname}: ${element.message}`,
  );
      io.emit('userConnected', formatData);
  };
  userLoggedIn();
});
