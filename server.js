require('dotenv/config');
const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

// const { DEFAULT_PORT } = require('./src/shared/defs');
const DEFAULT_PORT = process.env.PORT || 3000; // triste ter que fazer assim por puro bug

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${DEFAULT_PORT}`,
    method: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('conectado');

  socket.on('disconnect', () => {
    console.log('to off');
  });
});

app.use(cors());
app.use(express.static('public'));

require('./sockets')(io);

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/chat.html`);
});

http.listen(DEFAULT_PORT, () => {
  console.log(`App ouvindo na porta ${DEFAULT_PORT}`);
});
