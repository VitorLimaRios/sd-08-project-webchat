const messagesModel = require('../models/messagesModel');

const createMessage = async (req, res) => {
  try {
    const { message, nickname } = req.body;
    const messageCreated = await messagesModel.createMessage(message, nickname);
    res.status(201).json(messageCreated);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getAllMessages = async (_req, res) => {
  try {
    const allMessages = await messagesModel.getAllMessages();
    res.status(200).json(allMessages);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  createMessage,
  getAllMessages,
};