const express = require('express');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  } });

require('./sockets/webchat')(io);

app.get('/', (req, res) => res.end());

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});