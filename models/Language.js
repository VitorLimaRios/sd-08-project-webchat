const connection = require('./connection');

const getAll = () => connection().then(db => db.collection('languages').find({}).toArray());

module.exports = {
  getAll,
};
