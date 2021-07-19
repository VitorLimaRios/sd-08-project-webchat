const connection = require('./connection');

const createMessage = async (messageData) => {
  const db = await connection();
  await db.collection('messages').insertOne(messageData);
};

const getMessages = async () => {
  const db = await connection();
  const result = await db.collection('messages').find().toArray();
  return result;
};

module.exports = { createMessage, getMessages };
