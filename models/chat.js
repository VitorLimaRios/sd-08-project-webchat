const connection = require('./connection');

const getAllMessages = async () => connection()
  .then((db) => db.collection('messages').find({}).toArray());

const sendMessage = async (msg) => connection()
  .then((db) => db.collection('messages').insertOne({ msg }));

module.exports = { getAllMessages, sendMessage };
