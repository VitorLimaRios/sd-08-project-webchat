require('dotenv').config();

const { MongoClient } = require('mongodb');

let connection;

const getConnection = async (collectionName) => {
  connection = connection
    || (await MongoClient.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }));

  return connection.db(process.env.DB_NAME).collection(collectionName);
};

module.exports = getConnection;
