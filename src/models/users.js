const connection = require('./connection');

const saveUsers = async (nickname, userId) => {
  const usersSaved = await connection()
    .then((db) => db.collection('users').insertOne({ nickname, userId }));
  return usersSaved;
};

const getAll = async () => {
  const users = await connection()
    .then((db) => db.collection('users').find().toArray());

  return users;
};

module.exports = {
  saveUsers,
  getAll,
}; 
