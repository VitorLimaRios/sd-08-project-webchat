const connect = require('./connection');

const addMessage = async ({ chatMessage, nickname }) => {
  await connect()
    .then((db) => db.collection('messages').insertOne({
      message: chatMessage,
      nickname,
      timestamp: new Date().toLocaleString('pt-br').replace(/\//g, '-'),
    }));
};

const findAllMessage = async () => {
  const message = await connect()
  .then((db) => db.collection('messages').find().toArray());
  return message;
};

module.exports = {
  addMessage,
  findAllMessage,
};
