const { add, get, exclude, update } = require('../models/user');

exports.getUsersOn = async () => {
  return await get();
}

exports.addUserOn = async ({ connectId, nickname }) => {
  return await add({ connectId, nickname });
}

exports.removeUserOn = async ({ connectId }) => {
  await exclude({ connectId });
}

exports.updateUserOn = async ({ connectId, nickname }) => {
console.log(nickname)
  await update({ connectId, nickname })
}