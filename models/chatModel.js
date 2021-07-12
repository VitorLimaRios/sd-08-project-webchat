const connection = require('./connection');
require('dotenv/config');

const getAll = async () => {
  const db = await connection();
  const messages = await db.collection('messages').find().toArray();
  if (messages) return messages;
  throw new Error('deu ruim na requisição');
};

const saveMessage = async ({ message, nickname, timestamp }) => {
  const db = await connection();
  const newMessage = await db.collection('messages').insertOne({ message, nickname, timestamp });
  // console.log(newMessage);
  return newMessage;
};

module.exports = {
  getAll,
  saveMessage,
};
