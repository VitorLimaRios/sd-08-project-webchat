const Service = require('../services').Messages;
const utils = require('../utils');

module.exports = (io, socket) => {
  socket.on('message', async (data) => {
    const { chatMessage: message, nickname } = data;
    const modelData = { message, nickname, timestamp: new Date() };
    const chatMessage = utils.buildChatMessage(modelData);
    io.emit('message', chatMessage);
    await Service.insertOne(modelData);
  });
};
