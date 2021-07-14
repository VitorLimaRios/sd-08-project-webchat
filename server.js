const express = require('express');
const http = require('http');
require('dotenv').config();
const socketIO = require('socket.io');
const {
  joinRequest,
  disconnect,
  message,
  alterNickname,
} = require('./sockets/serverSockets');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.get('/', (req, res) => {
  res.render('index', { title: 'Chat em Tempo Real' });
});
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
app.use(express.static(`${__dirname}/views`));
let connectedUsers = [];
const messagesList = [];

io.on('connection', (socket) => {
  let userActual = socket;
  userActual = joinRequest(socket, userActual, connectedUsers, messagesList);
  disconnect(userActual, connectedUsers, userActual);
  message(socket, messagesList, io);
  const newUser = alterNickname(userActual, userActual, connectedUsers);
  connectedUsers = newUser.userList;
  userActual = newUser.userActual;
});

server.listen(PORT, () => {
  console.log('Servidor rodando na porta:', PORT);
});
