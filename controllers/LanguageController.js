const { Router } = require('express');

const WebChat = require('../models/WebChat');

const router = Router();

router.get('/', async (req, res) => {
  const WebChats = await WebChat.getAll();
  res.status(200).json(WebChats);
});
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const WebChats = await WebChat.getById(id);
    res.status(200).json(WebChats);
  });

module.exports = router;