const connection = require('./connection');

const NAME_COLLECTION = 'messages';

const writeMessage = async ({ nickname, message, timestamp }) => {
  const db = await connection();
  const { ops } = await db
    .collection(NAME_COLLECTION)
    .insertOne({ message, nickname, timestamp });
  const result = [ops];
  return result;
};

const readMessages = async () => {
  const db = await connection();
  const result = await db
    .collection(NAME_COLLECTION)
    .find()
    .toArray();
  return result;
};

module.exports = {
  readMessages,
  writeMessage,
};
