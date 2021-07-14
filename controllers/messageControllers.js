const messageModels = require('../models/messageModels');

const addMessage = async (timestamp, message) => {
  const { chatMessage, nickname } = message;
  await messageModels.addMessage(timestamp, nickname, chatMessage);
};

const getMessage = async () => {
  const messages = await messageModels.getMessage();
  return messages;
};

module.exports = {
  addMessage,
  getMessage,
};