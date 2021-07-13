const express = require('express');
const cors = require('cors');
const path = require('path');
const moment = require('moment');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const chatModel = require('./models/chatModel');

const clients = [];

const handleMessage = (chatMessage, nickname) => {
  const timestampMessage = moment(Date.now()).format('DD-MM-yyyy HH:mm:ss');
  chatModel.postMessage({ message: chatMessage, nickname, timestamp: timestampMessage });
  io.emit('message', `${timestampMessage} - ${nickname}: ${chatMessage}`);
};

io.on('connection', (socket) => {
  /* Conexão de novo cliente */
  socket.on('newUser', (nickname) => {
    clients.push({ userId: socket.id, nickname });
    // console.log(clients, "clients")
    socket.broadcast.emit('newUser', nickname);
  });

  socket.on('onlineUsers', () => io.emit('onlineUsers', clients));

  /* Envio de mensagens */
  socket.on('message', ({ chatMessage, nickname }) => {
    handleMessage(chatMessage, nickname);
  });

  /* Atualização de nickname */
  socket.on('updateUser', (nickname) => {
    const userIndex = clients.findIndex((client) => client.userId === socket.id);
    clients[userIndex].nickname = nickname;
    io.emit('onlineUsers', clients);
  });
});

const PORT = process.env.PORT || 3000;

app.get('/', async (_request, response) => {
  const messages = await chatModel.findAllMessages();
  response.render('index', { messages });
});

http.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));