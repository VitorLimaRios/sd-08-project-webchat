const connection = require('./connection');

const createMessage = async (timestamp, nickname, chatMessage) => {
  await connection()
    .then((db) => db.collection('messages').insertOne({ timestamp, nickname, chatMessage }));
};

const getMessage = async () => {
  const result = await connection()
    .then((db) => db.collection('messages').find({}).toArray());

  return result;
};

module.exports = {
  createMessage,
  getMessage,
};
