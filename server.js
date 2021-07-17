// Faça seu código aqui
require('dotenv').config();
const express = require('express');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const socket = require('./sockets');

socket.chat(io);

app.get('/', (_req, res) => {
  res.end();
});

const { PORT = 3000 } = process.env;
http.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}`));