// const { ObjectID } = require('mongodb');
// const connection = require('./connection');

const getAll = () => console.log('get all');
// connection().then((db) => db.collection('languages').find({}).toArray());

const increaseVotes = (id) => console.log('increaseVotes', id);
// connection().then((db) => db.collection('languages')
//   .updateOne(
//     { _id: ObjectID(id) },
//     { $inc: { votes: 1 } },
//   ));

const getById = (id) => console.log('get by id', id);
// connection().then((db) => db.collection('languages')
// .findOne({ _id: ObjectID(id) }));

module.exports = {
  getAll,
  increaseVotes,
  getById,
};