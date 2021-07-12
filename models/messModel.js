const connection = require('./connection');

const createMessage = async ({ message, nickname, timestamp }) => {
 const newMessage = connection()
  .then((db) => db.collection('messages').insertOne({ message, nickname, timestamp }))
  .then((result) => result.ops[0]);

  return newMessage;
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
