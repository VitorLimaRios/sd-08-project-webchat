const connect = require('./connection');

const sendMessageToDB = async (message, nickname, timestamp) => {
  const db = await connect();
  try {
    await db.collection('messages').insertOne({ message, nickname, timestamp });
  } catch (error) {
    console.log(error.message);
  }
};

const getMessagesHistory = async () => {
  const db = await connect();
  const allMessages = await db.collection('messages').find().toArray();
  return allMessages;
};

module.exports = {
  sendMessageToDB,
  getMessagesHistory,
};
