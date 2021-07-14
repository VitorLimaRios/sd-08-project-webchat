require('dotenv').config();
const express = require('express');
const moment = require('moment');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const chatModel = require('./models/chatModel');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(`${__dirname}/public`));

app.get('/', (_req, res) => res.render('index'));

const clients = {};
const currentTime = moment().format('DD-MM-YYYY h:mm:ss');

io.on('connection', async (socket) => {
  socket.emit('history', await chatModel.getChatMessages());

  socket.on('message', async (message) => {
    const { chatMessage, nickname } = message;
    await chatModel.saveChatMessage({ message: chatMessage, nickname, timestamp: currentTime });
    io.emit('message', `${currentTime} - ${nickname}: ${chatMessage}`);
  });

  socket.on('newUser', (nickname) => {
    clients[socket.id] = { nickname };
    io.emit('usersOnline', clients);
  });

  socket.on('updateNickname', (user) => {
    clients[user.id].nickname = user.nickname;
    io.emit('usersOnline', clients);
  });

  socket.on('disconnect', () => {
    delete clients[socket.id];
    io.emit('usersOnline', clients);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`App listining on port: ${PORT}`));
