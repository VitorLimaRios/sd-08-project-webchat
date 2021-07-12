// const chatModel = require('../models/chat');

const chat = async (_, res) => {
  try {
    /* const messages = await chatModel.getAllMessages() */
    await res.render('chat', { messages: 'funcionando' });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  chat,
};
