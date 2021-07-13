const conn = require('./connection');

const create = async (message) => conn()
  .then((db) => db.collection('messages')
  .insertOne({ ...message, timestamp: new Date() }));

const getAll = async () => conn()
  .then((db) => db.collection('messages')
  .find()
  .toArray());

module.exports = {
  create,
  getAll,
};
