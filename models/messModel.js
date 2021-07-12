const connection = require('./connection');

const createMessage = async ({ message, nickname, timestamp }) => {
 const newMessage = connection()
  .then((db) => db.collection('messages').insertOne(message, nickname, timestamp))
  .then((result) => result.ops[0]);

  console.log(newMessage);

  return newMessage;
};

// const findAllMessages = async () => connection().then((db) => db.collection('messages').find().toArray());;

module.exports = {
  createMessage,
  // findAllMessages,
};
