const connection = require('./connection');

const addNewMessage = async (messageData) =>
  connection()
    .then((db) => db.collection('messages').insertOne(messageData))
    .then((result) => result.ops[0]);

const getAllMessages = async () =>
  connection().then((db) => db.collection('messages').find().toArray());

const addNewUser = async (nickname) =>
  connection()
    .then((db) => db.collection('users').insertOne({ nickname }))
    .then((result) => result.ops[0]);

const updateUser = async ({ newNickname, oldNickname }) =>
  connection().then((db) =>
    db
      .collection('users')
      .updateOne({ nickname: oldNickname }, { $set: { nickname: newNickname } }));

const deleteUser = async (nickname) =>
  connection().then((db) => db.collection('users').deleteOne({ nickname }));

const getAllUsers = async () =>
  connection().then((db) => db.collection('users').find().toArray());

module.exports = {
  addNewMessage,
  getAllMessages,
  addNewUser,
  deleteUser,
  updateUser,
  getAllUsers,
};
