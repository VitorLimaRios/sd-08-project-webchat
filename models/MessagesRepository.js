const connection = require('./connection');

const getAllMesages = () => connection().then((db) => db.collection('messages').find({}).toArray());

const updateMessagesRepository = async ({ chatMessage, nickname, date }) => {
  const db = await connection();
  await db.collection('messages').insertOne({ 
    message: chatMessage,
    nickname,
    timestamp: date,  
   });
};

module.exports = {
  getAllMesages,
  updateMessagesRepository,
};