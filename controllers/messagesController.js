const messages = require('../models/messages');

let messegesList = [];

const chatHistory = async (_req, res) => {
  const history = await messages.history();
  if (history.length) {
    messegesList = [...history];
  }
  return res.status(200).render('Home', {
    chat: messegesList,
  });
};

const saveMessage = async (message) => {
try {
  await messages.saveMessage(message);
} catch (err) {
  console.log(err);
}
};

module.exports = {
  chatHistory,
  saveMessage,
};