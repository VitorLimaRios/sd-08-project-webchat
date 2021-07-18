const connection = require('./connection');

const saveMessage = async (message, nickname, timestamp) => {
  connection().then((db) => db.collection('messages')
  .insertOne({ message, nickname, timestamp }))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
};

const fetchMessages = async () => {
    const allMessages = connection()
    .then((db) => db.collection('messages').find().toArray())
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
    return allMessages;
};

module.exports = {
  saveMessage,
  fetchMessages,
};
