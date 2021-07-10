const express = require('express');
const path = require('path');

const route = express();

route.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'view/index.html'));
});

module.exports = route;
