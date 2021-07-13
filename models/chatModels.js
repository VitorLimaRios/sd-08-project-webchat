const connection = require('./connection');

const MESSAGES = 'messages';

const getMessages = async () => {
  const db = await connection();
  const result = await db.collection(MESSAGES).find().toArray();
  return result;
};

const writeMessage = async (message, nickname, timestamp) => {
  const db = await connection();
  const { ops } = await db.collection(MESSAGES).insertOne({ message, nickname, timestamp });
  const result = [ops];
  return result;
};

module.exports = {
  getMessages,
  writeMessage,
};
