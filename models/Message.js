const connection = require('./connection');

const getAll = async () => connection()
  .then((db) => db.collection('messages')
  .find({})
  .toArray());

const create = async (msg) => connection()
  .then((db) => db.collection('messages')
  .insertOne(msg));

module.exports = {
  getAll,
  create,
};
