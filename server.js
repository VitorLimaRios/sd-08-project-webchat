const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    method: ['GET', 'POST'],
  },
});

app.use(cors());

require('./sockets')(io);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/client.html`);
});

http.listen(PORT, () => {
  console.log('App ovindo na porta ', PORT);
});