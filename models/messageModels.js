const connection = require('./connection');

const getAll = () => connection().then((db) => 
  db.collection('messages').find({}, { projection: { _id: 0 } }).toArray());

const send = (message, nickname, timestamp) => connection()
.then((db) => db.collection('messages').insertOne({ message, nickname, timestamp }));

module.exports = { getAll, send };
