const express = require('express');

const chatModels = require('../models/chatModels');

const router = express.Router();
const OK = 200;

router.post('/', async (_req, _res) => {
  // console.log('post method', req.body);
});

router.get('/', async (_req, res) => {
  const result = await chatModels.getMessages();
  res.status(OK).json(result);
});

module.exports = router;
