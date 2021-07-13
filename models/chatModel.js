const getCollections = require('./connection');

const getAll = async () => 
    getCollections('messages').then((db) => db.find().toArray());

const create = async (message, nickname, timestamp) => {
    const messages = await getCollections('messages').then((db) => 
        db.insertOne(message, nickname, timestamp));
    return { _id: messages.insertedId, message, nickname, timestamp };
};

module.exports = {
    getAll,
    create,
};
