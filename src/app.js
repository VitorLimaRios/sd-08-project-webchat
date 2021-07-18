const express = require('express');
const cors = require('cors');

const router = require('./routes');

const app = express();

app.use(cors());
app.use(express.static('view'));

app.use(router);

module.exports = app;
