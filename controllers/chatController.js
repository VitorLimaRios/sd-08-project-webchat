const Model = require('../models/chatModel');

const chatController = async (req, res) => {
  try {
    const messages = await Model.getChatMessages();
    return res.status(200).render('../views/chat.ejs', { messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  chatController,
};