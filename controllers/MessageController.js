const { Router } = require('express');

const { getAllMesages } = require('../models/MessagesRepository');

const router = Router();

router.get('/', async (req, res) => {
  const messages = await getAllMesages();
  res.status(200).json(messages);
});

module.exports = router;