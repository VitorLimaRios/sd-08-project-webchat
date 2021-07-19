const connection = require('./connection');

const createMessage = async (message, nickname, timestamp) => {
  const newMessage = await connection()
    .then((db) => db.collection('messages')
      .insertOne({ message, nickname, timestamp }));
  return {
    _id: newMessage.insertedId,
    message,
    nickname,
    timestamp,
  };
};

const getAllMessages = async () => {
  const allMessages = await connection()
    .then((db) => db.collection('messages').find().toArray());
  return allMessages;
};

module.exports = {
  createMessage,
  getAllMessages,
};