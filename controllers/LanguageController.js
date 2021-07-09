const { Router } = require('express');

const Language = require('../models/Language');

const router = Router();

router.get('/', async (req, res) => {
  const languages = await Language.getAll();
  res.status(200).json(languages);
});
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const languages = await Language.getById(id);
    res.status(200).json(languages);
  });

module.exports = router;