const connection = require('./connection');

const addMessage = async (timestamp, nickname, message) => {
  connection().then(async (db) => {
    await db.collection('messages').insertOne({ message, nickname, timestamp });
  });
};

const getMessage = async () =>
  connection().then(async (db) => db.collection('messages').find().toArray());

module.exports = {
  addMessage,
  getMessage,
};
