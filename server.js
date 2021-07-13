const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000/', 
    methods: ['GET', 'POST'],
  } });

const chatController = require('./controllers/chatController');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', chatController.chat);

require('./sockets/chat')(io);

http.listen(3000, () => console.log('Ouvindo a porta 3000'));
