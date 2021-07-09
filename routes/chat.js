const chat = require('express').Router();

const chatController = require('../controllers/chat');

chat.get('/', chatController.chat);

module.exports = chat;
