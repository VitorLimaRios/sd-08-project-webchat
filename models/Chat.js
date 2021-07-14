const connection = require('./connection');

const getMessages = async () => {
  const db = await connection();
  const result = await db.collection('messages').find().toArray();
  return result;
};

const setMessage = async (message, nickname, timestamp) => {
  const db = await connection();
  const { ops } = await db
    .collection('messages')
    .insertOne({ message, nickname, timestamp });
  return [ops];
};

module.exports = {
  getMessages,
  setMessage,
};
