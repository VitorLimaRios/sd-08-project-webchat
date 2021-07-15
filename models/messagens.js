const connection = require('./connection');

const saveMessage = async (message) => connection()
  .then((db) => db.collection('messages').insertOne({ ...message }));

const getMessagens = async () => connection()
  .then((db) => db.collection('messages').find().toArray());

module.exports = {
  saveMessage,
  getMessagens,
};  