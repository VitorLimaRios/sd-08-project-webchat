const { Router } = require('express');

const router = Router();

const chatModel = require('../models/chatModel');

router.get('/', async (_req, res) => {
  const messages = await chatModel.getAll();
  res.status(200).render('index', { messages });
});

router.post('/', async (req, res) => {
  await chatModel.create(req.body);
  res.status(200).json({ enviado: 'ok' });
});

module.exports = router;
