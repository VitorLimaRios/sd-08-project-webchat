const chatModel = require('../models/chatModel');

module.exports = async (_req, res) => {
  const chat = await chatModel.getAll();
  res.status(200).render('./index', { chat });
};
