const connection = require('./connection');

const create = async ({ message, nickname, timestamp }) => {
  const createMessage = await connection()
  .then((db) => db.collection('messages')
  .insertOne({ message, nickname, timestamp }));
  return createMessage.ops[0];
};

const getAll = async () => {
  const getAllMessages = await connection()
  .then((db) => db.collection('messages')
  .find().toArray());
  return getAllMessages;
};

module.exports = {
  create,
  getAll,
};