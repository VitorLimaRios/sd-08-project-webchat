// const { ObjectID } = require('mongodb');
const connection = require('./connection');
require('dotenv').config();

const getAll = () => connection().then((db) => db.collection('historicMessage').find({}).toArray());

const insert = (message) => connection().then((db) => 
db.collection('historicMessage').insert(message));

// const increaseVotes = (id) => console.log('increaseVotes', id);
// // connection().then((db) => db.collection('languages')
// //   .updateOne(
// //     { _id: ObjectID(id) },
// //     { $inc: { votes: 1 } },
// //   ));

// const getById = (id) => console.log('get by id', id);
// // connection().then((db) => db.collection('languages')
// // .findOne({ _id: ObjectID(id) }));

module.exports = {
  getAll,
  insert,
};