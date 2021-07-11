const ChatModel = require('../models/chatModel');

const create = async (_req, _res) => ChatModel.create();

const getAll = async (_req, _res) => ChatModel.getAll();

module.exports = {
  create,
  getAll,
};