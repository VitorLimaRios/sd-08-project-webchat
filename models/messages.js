const connection = require('./connection');

const saveMessage = async (chatMessage) => connection()
  .then((db) => db.collection('messages').insertOne(chatMessage)
    .then((result) => result.ops[0]));

const history = async () => connection()
.then((db) => db.collection('messages').find().toArray()
  .then((result) => result));

module.exports = {
  saveMessage,
  history,
};
