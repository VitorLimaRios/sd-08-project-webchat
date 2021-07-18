const connection = require('./connection');

const saveMessage = (message, nickname, timestamp) => {
  connection().then((db) => db.collection('messages').insertOne({ message, nickname, timestamp })); 
};

const fetchMessages = () => {
  const allMessages = connection().then((db) => db.collection('messages').find().toArray());
  return allMessages;
};

module.exports = {
  saveMessage,
  fetchMessages,
};
