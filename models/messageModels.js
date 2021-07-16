const connect = require('./connection');

const saveMessageBD = async (message, nickname, timestamp) => 
  connect().then(async (db) => {
    const messageInput = await db.collection('messages')
      .insertOne({ message, nickname, timestamp });

    return messageInput.ops[0];
  });

  const getMessageBD = async () => 
  connect().then(async (db) => {
    const getMessage = await db.collection('messages').find().toArray();
    return getMessage;
  });  

  module.exports = {
    saveMessageBD,
    getMessageBD,
  };