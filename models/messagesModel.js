const connection = require('./connection');

const createMessage = async (timestamp, nickname, message) => {
  const result = await connection()
    .then((db) => db.collection('messages').insertOne({ timestamp, nickname, message }))
    .then((msg) => ({ _id: msg.insertedId, timestamp, nickname, message }));

  return result;
};

const getMessage = async () => {
  const result = await connection()
    .then((db) => db.collection('messages').find({}).toArray());

  return result;
};

const getMessageById = async (id) => {
  const result = await connection().then((db) => db.collection('messages').findOne({ _id: id }));

  return result;
};

module.exports = {
  createMessage,
  getMessage,
  getMessageById,
};
