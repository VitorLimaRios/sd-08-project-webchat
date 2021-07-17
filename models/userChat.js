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
      .updateOne({ _id: ObjectID(id) }, { $set: { nickname: newNickname } }));
};

const addMessage = (message) => {
  connection().then((db) => db.collection('messages').insertOne({ message }));
};

const getByName = (nickname) => {
  connection().then((db) => db.collection('users').findOne({ nickname }));
};

const getAllMessages = async () => {
  connection().then((db) => db.collection('messages').find().toArray());
};

module.exports = {
  getAll,
  addUser,
  updateNickName,
  addMessage,
  getByName,
  getAllMessages,
};
