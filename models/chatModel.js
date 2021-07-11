const connection = require('./connection');

const addNewMessage = async (messageData) =>
  connection()
    .then((db) => db.collection('messages').insertOne(messageData))
    .then((result) => result.ops[0]);

const getAllMessages = async () =>
  connection().then((db) => db.collection('messages').find().toArray());

module.exports = {
  addNewMessage,
  getAllMessages,
};
