const routes = require('express').Router();
const userController = require('../controllers');

routes.get('/', userController.chatRoon);

module.exports = routes;
