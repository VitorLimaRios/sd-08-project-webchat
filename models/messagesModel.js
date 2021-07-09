const connection = require('./connection');

const saveMessage = async (message) => {
  const { nickname, content, date } = message;
  const db = await connection();
  const newMessage = await db.collection('messages')
    .insertOne({ nickname, message: content, timestamp: date });
  return newMessage;
};

module.exports = {
  saveMessage,
};