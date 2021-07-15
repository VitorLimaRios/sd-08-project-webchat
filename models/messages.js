const connection = require('./connection');

const createMessage = async ({ message, nickname, timestamp }) =>
  connection()
  .then((db) => db.collection('messages')
  .insertOne({ message, nickname, timestamp }));

const getAllMessages = async () => 
  connection()
  .then((db) => db.collection('messages')
  .find({}).toArray());

module.exports = {
  createMessage,
  getAllMessages,
};