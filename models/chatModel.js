const connection = require('./connection');

// const create = async ({ message, nickname, timestamp }) =>
//   connection().then((db) => db.collection('messages').insertOne({ message, nickname, timestamp }));

// const getAll = async () => 
//   connection().then((db) => db.collection('messages').find({}).toArray());

// module.exports = {
//   create,
//   getAll,
// };

const postMessage = async ({ message, nickname, timestamp }) =>
  connection().then((db) => db.collection('messages').insertOne({ message, nickname, timestamp }));

const findAllMessages = async () =>
  connection().then((db) => db.collection('messages').find({}).toArray());

module.exports = { postMessage, findAllMessages };