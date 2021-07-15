const { add, get, exclude, update } = require('../models/user');

exports.getUsersOn = async () => get();

exports.addUserOn = async ({ connectId, nickname }) => add({ connectId, nickname });

exports.removeUserOn = async ({ connectId }) => {
  await exclude({ connectId });
};

exports.updateUserOn = async ({ connectId, nickname }) => {
  console.log(nickname);
  await update({ connectId, nickname });
};