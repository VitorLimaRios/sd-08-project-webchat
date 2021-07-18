// Faça seu código aqui
require('dotenv/config');

const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const DEFAULT_PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${DEFAULT_PORT}`,
    method: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Connected');

  socket.on('disconnect', () => {
    console.log('Disconneted');
  });
});

app.use(cors());

app.use(express.static('view'));

require('./sockets')(io);

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/view/chat.html`);
});

http.listen(DEFAULT_PORT, () => {
  console.log(`App listening on port ${DEFAULT_PORT}`);
});
