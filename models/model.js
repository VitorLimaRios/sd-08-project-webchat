const connection = require('./connection');

const getAllMessages = async () => connection()
  .then((db) => db.collection('messages').find().toArray());

const newMessage = (message) => connection()
  .then((db) => db.collection('messages').insertOne(message));

module.exports = {
    getAllMessages,
    newMessage,
};  