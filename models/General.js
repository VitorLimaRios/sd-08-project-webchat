const { ObjectId } = require('mongodb');
const connection = require('./connection');

const withCollection = async (collecName) => connection()
  .then((db) => db.collection(collecName));

const findAll = async (collecName) => (
  withCollection(collecName)
    .then((coll) => coll.find().toArray())
);

const findById = async (collecName, id) => {
  try {
    return await withCollection(collecName)
      .then((coll) => coll.findOne(new ObjectId(id)));
  } catch (err) {
    return null;
  }
};

const insertOne = async (collecName, obj) => {
  try {
    const { insertedId } = await withCollection(collecName)
      .then((coll) => coll.insertOne(obj));
    return insertedId;
  } catch (err) {
    return undefined;
  }
};

const deleteById = async (collecName, id) => {
  try {
    const { deletedCount } = await withCollection(collecName)
      .then((coll) => coll.deleteOne({ _id: new ObjectId(id) }));
    if (!deletedCount) return false;
    return true;
  } catch (err) {
    return false;
  }
};

const updateById = async (collecName, id, obj) => {
  const { modifiedCount } = await withCollection(collecName)
    .then((coll) => coll.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...obj } },
    ));
  if (!modifiedCount) return false;
  return true;
};

const findWith = async (collecName, obj) => (
  withCollection(collecName)
    .then((coll) => coll.find({ ...obj }).toArray())
);

module.exports = {
  findAll,
  findById,
  insertOne,
  deleteById,
  updateById,
  findWith,
};
