const connection = require('./connection');

const createMessage = async ({ message, nickname, timestamp }) => {
  const db = await connection();
  const searchResult = await db
    .collection('messages')
    .insertOne({ message, nickname, timestamp });
  return searchResult.ops[0];
};

const findAllMessages = async () => {
  const db = await connection();
  const allMessages = await db.collection('messages').find().toArray();
  return allMessages;
};

module.exports = {
  createMessage,
  findAllMessages,
};
