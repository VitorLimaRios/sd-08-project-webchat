const connection = require('./connection');

const getMessages = async () => connection().then((db) => db.collection('messages'));

const createMessage = async ({ message, nickname, timestamp }) => {
  const messages = await getMessages();
  const { insertedId } = messages.insertOne({ message, nickname, timestamp });
  return { _id: insertedId, message, nickname, timestamp };
};

const findAllMessages = async () => {
  const allMessages = connection().then((db) => db.collection('messages').find().toArray());
  return allMessages;
};

module.exports = {
  createMessage,
  findAllMessages,
};