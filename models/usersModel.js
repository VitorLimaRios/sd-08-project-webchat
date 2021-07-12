const connection = require('./connection');

const createUser = async ({ nickname, socketId }) => {
  await connection()
    .then((db) => db.collection('users').insertOne({ nickname, socketId }));
};

const getUsers = async () => {
  const result = await connection()
    .then((db) => db.collection('users').find().toArray());
  return result;
};

const updateUser = async (id, nickname) => {
  await connection()
    .then((db) => db.collection('users').updateOne({ socketId: id }, { $set: { nickname } }));
};

const removeUser = async (id) => {
  await connection()
    .then((db) => db.collection('users').deleteOne({ socketId: id }));
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  removeUser,
};
