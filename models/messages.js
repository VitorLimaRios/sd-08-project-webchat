const connection = require('./connection');

const saveMessage = async (message, nickname, timestamp) => {
  connection().then((db) => db.collection('messages').insertOne({ message, nickname, timestamp })); 
};

const fetchMessages = async () => {
  const allMessages = connection().then((db) => db.collection('messages').find().toArray());
  return allMessages;
};

module.exports = {
  saveMessage,
  fetchMessages,
};
