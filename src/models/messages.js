const connection = require('./connection');

const saveMessages = async (message, nickname, timestamp) => {
  const messagesSaved = await connection()
    .then((db) => db.collection('messages').insertOne({ message, nickname, timestamp }));
  return messagesSaved;
};

const getAll = async () => {
  const messages = await connection()
    .then((db) => db.collection('messages').find().toArray());

  return messages;
};

module.exports = {
  saveMessages,
  getAll,
}; 
