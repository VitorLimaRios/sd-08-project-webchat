const messagesModel = require('../models/messagesModel');

const renderHomePage = async (_req, res) => {
  const messages = await messagesModel.getAllMessages();
  res.render('home', { messages });
};

module.exports = { renderHomePage };