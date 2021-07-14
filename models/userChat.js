const { ObjectID } = require('mongodb');
const connection = require('./connection');

const addUser = (nickname) => {
  connection().then((db) => db.collection('users').insertOne({ nickname }));
};

const updateNickName = (id, newNickname) =>
  connection().then((db) =>
    db
      .collection('users')
      .updateOne({ _id: ObjectID(id) }, { nickname: newNickname }));

const addMessage = (message) => {
  connection().then((db) => db.collection('messages').insertOne({ message }));
};

module.exports = {
  addUser,
  updateNickName,
  addMessage,
};
