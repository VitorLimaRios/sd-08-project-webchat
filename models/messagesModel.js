const connection = require('./connection');

const saveMessage = async (message) => {
  const { nickname, content, date } = message;
  const db = await connection();
  const newMessage = await db.collection('messages')
    .insertOne({ nickname, message: content, timestamp: date });
  return newMessage;
};

const getMessages = async () => {
  const db = await connection();
  const messages = await db.collection('messages').find().toArray();
  return messages;
};

module.exports = {
  saveMessage,
  getMessages,
};