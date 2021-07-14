const connection = require('./connection');

const getAll = async () => connection()
  .then((db) => db.collection('messages')
  .find({})
  .toArray());

const create = async (chatMessage, nickname, dateMsg) => connection()
  .then((db) => db.collection('messages')
  .insertOne({
    chatMessage,
    nickname,
    timestamp: dateMsg,
  }));

module.exports = {
  getAll,
  create,
};