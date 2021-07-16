const connection = require('./connection');

const insertMessage = async (data) => connection()
  .then((db) => db.collection('messages').insertOne(data));

const getAllMessages = async () => connection()
  .then((db) => db.collection('messages').find().toArray());

module.exports = { insertMessage, getAllMessages };
