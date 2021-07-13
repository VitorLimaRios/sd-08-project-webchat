const Model = require('../models').General;

const COLLECTION_NAME = 'messages';

const findAll = async () => {
  const resources = await Model.findAll(COLLECTION_NAME);
  return { result: resources };
};

const insertOne = async (obj) => {
  const insertedId = await Model.insertOne(COLLECTION_NAME, obj);
  if (!insertedId) {
    return { error: { code: 'unprocessable_entity', message: 'Problem on server' } };
  }
  return { result: { _id: insertedId, ...obj } };
};

const deleteById = async (id) => {
  const resp = await Model.deleteById(COLLECTION_NAME, id);
  if (!resp) {
    return { error: { code: 'unprocessable_entity', message: 'Wrong id format' } };
  }
  return { result: {
    message: `The message with id = ${id} was deleted successfully` } };
};

module.exports = {
  findAll,
  insertOne,
  deleteById,
};
