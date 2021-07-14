const connection = require('./connection');

exports.add = async ({ message, nickname, timestamp }) =>
connection().then(async (db) => {
    const messageChannel = await db
      .collection('messages')
      .insertOne({ message, nickname, timestamp });
    return messageChannel.ops[0];
  });

  exports.get = async () =>
  connection().then((db) => db.collection('messages').find().toArray());