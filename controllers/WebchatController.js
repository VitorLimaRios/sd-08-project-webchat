const { Router } = require('express');
const Language = require('../models/Language');

const router = Router();

router.get('/', async (_req, res) => {
  const languages = await Language.getAll();
  res.status(200).json(languages);
});

module.exports = router;
