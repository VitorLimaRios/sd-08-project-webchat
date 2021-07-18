const connection = require('./connection');

const create = async (newMessage) => {
  const db = await connection();
  await db.collection('messages').insertOne(newMessage);
};

const serialize = ((newMessage) => {
  const { message, nickname, timestamp } = newMessage;
  return { message, nickname, timestamp };
});

const getAll = async () => {
  const db = await connection();
  const messages = await db.collection('messages').find().toArray();
  return messages.map(serialize);
};

module.exports = {
  create,
  getAll,
};