const chatModel = require('../models/chat');

const chat = async (_, res) => {
  try {
    const messages = await chatModel.getAllMessages();
    const newMsg = messages
      .map((item) => `${item.timestamp} - ${item.nickname}: ${item.chatMessage}`);
    res.render('chat', { messages: newMsg });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  chat,
};
