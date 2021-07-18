const { Router } = require('express');
const { getAll, send } = require('../models/messageModels');
const getDate = require('../public/utils/getDate');

const router = Router();

router.get('/get', async (req, res) => {
  const messages = await getAll();
  res.status(200).json(messages);
});

router.post('/send', async (req, res) => {
  const { message, nickname } = req.body;
  const timestamp = getDate();
  await send(message, nickname, timestamp);
  res.status(200).json({ message, nickname, timestamp });
});

module.exports = router;