const connection = require('./connection');

const insertUserMessage = async (message, nickname, timestamp) =>
  connection()
    .then((db) =>
      db.collection('messages').insertOne({ message, nickname, timestamp }))
    .then((response) => response);

const getAllUsersMessages = async () =>
  connection()
    .then((db) => db.collection('messages').find().toArray())
    .then((users) => users);

module.exports = {
  insertUserMessage,
  getAllUsersMessages,
};
