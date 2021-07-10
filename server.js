const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);

const PORT = 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

require('./sockets/chat')(io);

app.use(express.static(path.join(__dirname, '/public')));

app.use(require('./controller'));

http.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
});
