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

const getUserById = async (id) => {
  const result = await connection().then((db) => db.collection('users').findOne({ _id: id }));

  return result;
};

const updateUser = async (id, name) => {
  await connection()
    .then((db) => db.collection('users').updateOne({ _id: id }, { $set: { name } }));

  return name;
};

const removeUser = async (id) => {
  await connection()
    .then((db) => db.collection('users').deleteOne({ socketId: id }));
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  removeUser,
};
