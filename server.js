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

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('public'));

const socket = require('./sockets');

socket.chat(io);

app.get('/', (_req, res) => {
  res.render('chat');
});

const { PORT = 3000 } = process.env;
http.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}`));