const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  } });

const chatController = require('./controllers/chatController');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', chatController.chat);

require('./sockets/chat')(io);

http.listen(3000, () => console.log('Ouvindo a porta 3000'));
