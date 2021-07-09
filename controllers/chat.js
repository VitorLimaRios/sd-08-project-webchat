const crypto = require('crypto');

const chatModel = require('../models/chat');

const chat = async (_req, res) => {
const randomId = crypto.randomBytes(8).toString('hex');
const messages = await chatModel.getAll();

  res.render('chat', { name: randomId, messages });
};

module.exports = {
  chat,
};
