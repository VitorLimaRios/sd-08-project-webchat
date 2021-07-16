require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

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