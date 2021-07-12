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
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});
    
const ChatModel = require('./models/chatModel');

let clients = [];

const inputMessage = (chatMessage, nickname) => {
  const timestampMessage = moment(Date.now()).format('DD-MM-yyyy HH:mm:ss');
  ChatModel.create({ message: chatMessage, nickname, timestamp: timestampMessage });
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

  /* Atualização de nickname */
  socket.on('updateUser', (nickname) => {
    clients = clients.map((client) => {
      if (client.userId === socket.id) { 
        return { userId: socket.id, nickname };
      }
      return client;
    });
  io.emit('onlineUsers', clients);
  });

  /* Nova mensagem */
  socket.on('message', ({ chatMessage, nickname }) => {
    inputMessage(chatMessage, nickname);
  });
});

app.get('/', async (_req, res) => { 
  const messages = await ChatModel.getAll();
  res.render('index.ejs', { messages });
});

const PORT = process.env.PORT || 3000;  

http.listen(PORT, () => {
  console.log(`Running server on port ${PORT}`);
});