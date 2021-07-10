const WebChat = require('../models/WebChat');

module.exports = async (_req, res) => {
  const messages = await WebChat.getAll();
  res.status(200).render('index', { messages });
};
