const chatModel = require('../models/chatModel');

const chat = async (__req, res) => {
  const chatHistory = await chatModel.findAllMessage();
  res.status(200).render('chat/chat', { chatHistory });
};

module.exports = {
  chat,
};
