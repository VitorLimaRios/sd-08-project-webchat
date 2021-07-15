const connection = require('./connection');

exports.add = ({ connectId, nickname }) =>
  connection().then((db) => db
    .collection('usersOn')
    .insertOne({ connectId, nickname }));

exports.get = () =>
  connection().then((db) => db.collection('usersOn').find().toArray());

exports.update = ({ connectId, nickname }) =>
  connection().then((db) => db
    .collection('usersOn')
    .updateOne({ connectId }, { $set: { nickname } }));

exports.exclude = ({ connectId }) =>
  connection().then((db) =>
    db
      .collection('usersOn')
      .deleteOne(connectId));