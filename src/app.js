const express = require('express');
const cors = require('cors');

const router = require('./router/index.routes');

const app = express();

app.use(cors());
app.use(express.static('public'));

app.use(router);

module.exports = app;
