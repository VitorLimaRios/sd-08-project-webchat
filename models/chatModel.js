const connection = require('./connection');

const getChatMessages = async () => {
  const data = await connection().then((db) => db.collection('messages').find({}).toArray());
  return data;
};

const postChatMessage = async (message) => {
  await connection().then((db) => db.collection('messages').insertOne(message));
};

module.exports = {
  getChatMessages,
  postChatMessage,
};