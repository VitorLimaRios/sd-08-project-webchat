const express = require('express');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

const { PORT } = process.env;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const { chatController } = require('./controllers/chatController');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());
require('./sockets/chat')(io);

app.get('/', chatController);

http.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});