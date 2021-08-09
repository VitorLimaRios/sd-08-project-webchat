const connection = require('./connection');

const create = async (message) => {
  const messages = await connection()
    .then((db) => db.collection('messages'));
  messages.insertOne({ message });
};

const getAll = async () => connection()
  .then((db) => db.collection('messages').find().toArray());

module.exports = {
  create,
  getAll,
};
