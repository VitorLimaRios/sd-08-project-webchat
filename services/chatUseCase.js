const { add } = require('../models/message');

exports.saveMessage = async ({ chatMessage, nickname, date }) => {
  await add({ nickname, message: chatMessage, timestamp: date });
};