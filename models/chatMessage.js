const connection = require('./connection');

const createChatMessage = async (chatMessage, nickName, timestamp) => {
  const db = await connection();
  const chatData = await db.collection('messages')
    .insertOne({ chatMessage, nickName, timestamp });
  return chatData;
};

const getAllChatMessages = async () => {
  const db = await connection();
  const chatData = db.collection('messages').find().toArray();
  return chatData;
};

module.exports = {
  createChatMessage,
  getAllChatMessages,
};