const express = require('express');
const rescue = require('express-rescue');
const messagesController = require('../controllers/messagesController');

const router = express.Router();

router.post('/message', rescue(messagesController.createMessage));
router.get('/message', rescue(messagesController.getAllMessages));

module.exports = router;