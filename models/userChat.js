const { ObjectID } = require('mongodb');
const connection = require('./connection');

const getAll = () => {
  connection().then((db) => db.collection('users').find({}).toArray());
};
  
const addUser = (nickname) => {
  connection().then((db) => db.collection('users').insertOne({ nickname }));
};

const updateNickName = (id, newNickname) => {
  connection().then((db) =>
    db
      .collection('users')
      .updateOne({ _id: ObjectID(id) }, { nickname: newNickname }));
};

const addMessage = (message) => {
  connection().then((db) => db.collection('messages').insertOne({ message }));
};

const getByName = (nickname) => {
  connection().then((db) => db.collection('users').findOne({ nickname }));
};

module.exports = {
  getAll,
  addUser,
  updateNickName,
  addMessage,
  getByName,
};
