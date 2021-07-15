const connection = require('./connection');

exports.add = async ({ connectId, nickname }) =>
  connection().then(async (db) => {
    const messageChannel = await db
      .collection('usersOn')
      .insertOne({ connectId, nickname });
    return messageChannel.ops[0];
  });

exports.get = async () =>
  connection().then((db) => db.collection('usersOn').find().toArray());

exports.update = async ({ connectId, nickname }) =>
  connection().then(async (db) => await db
    .collection('usersOn')
    .updateOne( {connectId}, { $set: {nickname}})
  );

exports.exclude = async ({connectId}) =>
  connection().then(async (db) =>
    await db
      .collection('usersOn')
      .deleteOne(connectId)
  );