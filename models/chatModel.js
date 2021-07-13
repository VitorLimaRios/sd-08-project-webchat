const connection = require('./connection');

const getAll = async () => {
  try {
    const db = await connection();
    const response = await db.collection('messages').find().toArray();
    const array = [];
    response.forEach((e) => {
      array.push(`${e.timestamp} - ${e.nickname}: ${e.message}`);
    });
    return array;
  } catch (error) {
    return { error: error.message };
  }
};

const newMessage = async (message) => {
  try {
    const db = await connection();
    const response = await db.collection('messages').insertOne(message);
    return response.ops[0];
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = {
  getAll,
  newMessage,
};
