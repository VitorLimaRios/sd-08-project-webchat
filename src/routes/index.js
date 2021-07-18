const router = require('express').Router();

const useController = require('../controllers');

router.get('/', useController.sendFile);

module.exports = router;
