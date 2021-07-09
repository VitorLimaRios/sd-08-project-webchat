const connection = require('./connection');

require('dotenv/config');

const COLLECTION_NAME = 'messages';

const create = async (message) => {
const newMessage = await connection()
  .then((db) => db.collection(COLLECTION_NAME).insertOne(message));

  return newMessage;
};

const getAll = async () => connection()
.then((db) => db.collection(COLLECTION_NAME).find().toArray());

module.exports = {
  create,
  getAll,
};