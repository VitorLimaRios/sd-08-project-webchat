require('dotenv').config();
const express = require('express');

const app = express();
const http = require('http').createServer(app);

app.use(express.static(`${__dirname}/public`));

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

require('./sockets/chatSocket')(io);

app.get('/', async (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
