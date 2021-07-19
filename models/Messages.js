const connection = require('./connection');

const insertNewMessage = async (messageOBJ) => {
  const connect = await connection();
  const { message, nickname, timestamp } = messageOBJ;

  await connect.collection('messages').insertOne({ message, nickname, timestamp });
};

const getMessages = async () => {
  const connect = await connection();

  const messages = await connect.collection('messages').find().toArray();

  return messages;
};

module.exports = {
  getMessages,
  insertNewMessage,
};