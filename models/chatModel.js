const connection = require('./connection');

const create = async (message) =>
  connection()
    .then((db) => db.collection('messages').insertOne(message))
    .then((result) => {
        console.log([result.ops[0]]);
        return result.ops[0];
    });

const getAllMessages = async () =>
  connection().then((db) => db.collection('messages').find().toArray());

  module.exports = {
    create,
    getAllMessages,
};