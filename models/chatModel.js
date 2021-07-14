const connection = require('./connection');

const saveChatMessage = async (messageData) => {
  const db = await connection();
  await db.collection('messages').insertOne(messageData);
};

const getChatMessages = async () => {
  const db = await connection();
  const chatMessages = await db.collection('messages').find().toArray();

  return chatMessages;
};

module.exports = { saveChatMessage, getChatMessages };
