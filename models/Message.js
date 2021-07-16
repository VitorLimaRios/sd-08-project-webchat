const connection = require('./connection');

const getAll = async () => connection()
  .then((db) => db.collection('messages')
  .find({})
  .toArray());

const create = async (message, nickname, dateMsg) => connection()
  .then((db) => db.collection('messages')
  .insertOne({
    message,
    nickname,
    timestamp: dateMsg,
  }));

module.exports = {
  getAll,
  create,
};
