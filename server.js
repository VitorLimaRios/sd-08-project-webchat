const express = require('express');

const app = express();
const cors = require('cors');
const path = require('path');
const http = require('http').createServer(app);
const moment = require('moment');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const ChatModel = require('./models/chatModel');

let clients = [];
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());
app.use(express.static(path.join(__dirname, 'views')));

// https://github.com/tryber/sd-07-project-webchat/blob/paula-jfe-webchat-project/server.js
const handleMessage = (chatMessage, nickname) => {
  const timestampMessage = moment(Date.now()).format('DD-MM-yyyy HH:mm:ss');
  ChatModel.create({ message: chatMessage, nickname, timestamp: timestampMessage });
  io.emit('message', `${timestampMessage} - ${nickname}: ${chatMessage}`);
};

const handleDisconnect = (updatedClients) => {
  clients = updatedClients;
  io.emit('onlineUsers', clients);
  io.emit('disconnectUser');
};

io.on('connection', (socket) => {
  /* cliente se conecta */
  socket.on('newUser', (nickname) => {
    clients.push({ userId: socket.id, nickname });
    // console.log(clients, "clients")
    socket.broadcast.emit('newUser', nickname);
  });

  socket.on('onlineUsers', () => io.emit('onlineUsers', clients));

  /* mensagens enviadas */
  socket.on('message', ({ chatMessage, nickname }) => {
    handleMessage(chatMessage, nickname);
  });

  /* cliente atualiza seu _nickname_ */
  socket.on('updateUser', (nickname) => {
    const userIndex = clients.findIndex((client) => client.userId === socket.id);
    clients[userIndex].nickname = nickname;
    io.emit('onlineUsers', clients);
  });

  /* cliente se desconecta */
  socket.on('disconnect', () => {
    const allClients = clients.filter((c) => c.userId !== socket.id);
    handleDisconnect(allClients);
  });
});

app.get('/', async (_request, response) => {
  const messages = await ChatModel.getAll();
  response.render('index', { messages });
});

http.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

// https://qastack.com.br/programming/10058226/send-response-to-all-clients-except-sender