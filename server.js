// Faça seu código aqui
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

app.set('view engine', 'ejs');

app.set('views', './views');

app.use(cors());

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id}`);
});

app.use(express.static(path.join(__dirname, '/public')));

require('./sockets/chat')(io);

const OK = 200;
const PORT = 3000;

app.get('/', (_req, res) => {
  // res.sendFile(path.join(__dirname, '/index.html'));
  res.status(OK).render('chat/index');
});

http.listen(PORT, () => console.log(`Servidor aberto na porta ${PORT}.`));
