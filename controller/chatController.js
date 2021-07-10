const ChatMessage = require('../models/chatMessage');

const OK = 200;

const addChatMessage = async (_req, res) => {
  const chatMessages = await ChatMessage.getAllChatMessages();
  return res.status(OK).json(chatMessages);
};

module.exports = {
  addChatMessage,
};