const model = require('../models/chatModel');

const getAllMessages = async (_req, res) => {
  try {
    const chatHistory = await model.getAll();
    res.status(200).render('index', { chatHistory });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getAllMessages,
};
