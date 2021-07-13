const express = require('express');
const chatController = require('../controllers/chatController');

const routes = express.Router();

routes.get('/', chatController.chat);

module.exports = routes;