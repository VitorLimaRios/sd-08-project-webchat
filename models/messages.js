const connection = require('./connection');

const saveMessage = async (message, nickname, timestamp) => {
  try {
    connection().then((db) => db.collection('messages')
    .insertOne({ message, nickname, timestamp }));
  } catch (err) { console.log(err); }
};

const fetchMessages = async () => {
  try {
    const allMessages = connection().then((db) => db.collection('messages').find().toArray());
    return allMessages;
  } catch (err) { console.log(err); }
};

module.exports = {
  saveMessage,
  fetchMessages,
};
