const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const formatedDate = require('dateformat');
const bodyParser = require('body-parser');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  } });

const { addMessage, getMessage } = require('./controllers/messageControllers');

const now = new Date();
const fullDate = String(formatedDate(now, 'dd-mm-yyyy HH:MM:ss TT'));
  
  const users = {};

  io.on('connection', async (socket) => {
    socket.on('newUser', (nickname) => {
      users[socket.id] = nickname; io.emit('loadUsers', Object.values(users));
    });

    socket.on('message', async (message) => {
      io.emit('message', `${fullDate} - ${message.nickname}: ${message.chatMessage}`);
      await addMessage(fullDate, message);
    });

    socket.on('nickname', (nickname) => {
      users[socket.id] = nickname; io.emit('loadUsers', Object.values(users)); 
     });

    socket.on('disconnect', () => {
      delete users[socket.id]; io.emit('loadUsers', Object.values(users)); 
     });

    const messages = await getMessage();
    console.log(messages);
      messages.forEach((message) => {
      socket.emit('messageLoad', `${fullDate} - ${message.nickname}: ${message.message}`);
  });
});

const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(`${__dirname}/public`));

http.listen(PORT, () => console.log(`Ouvindo na porta ${PORT}`));
