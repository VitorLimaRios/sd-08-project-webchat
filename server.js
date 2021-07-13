const express = require('express');
const dateFormat = require('dateformat');

const app = express();

const fetch = require('node-fetch');

const http = require('http').createServer(app);

const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
const sendToMongo = (message) => {
  fetch('http://localhost:3000/', {
    method: 'POST',
    body: JSON.stringify(message),
    headers: { 'Content-type': 'application/json' },
    });
};
let nicknames = [];
const changeUser = (nickname, nick) => {
  const position = nicknames.findIndex((e) => e === nick);
  nicknames[position] = nickname;
  io.emit('user', nicknames);
};
const newUser = (nickname, socket) => {
  nicknames.push(nickname);
  io.emit('user', nicknames);
  socket.emit('user', nicknames.reverse());
};

io.on('connection', (socket) => {
  const dateTime = dateFormat(new Date(), 'dd-mm-yyyy hh:mm:ss');
  let nick;
  socket.on('message', (message) => {
    sendToMongo({ 
      message: `${message.chatMessage}`,
      nickname: `${message.nickname}`,
      timestamp: `${dateTime}`,
    });
    io.emit('message', `${dateTime} - ${message.nickname}: ${message.chatMessage}`);
  });
  socket.on('disconnect', () => {
    nicknames = nicknames.filter((e) => e !== nick);
    io.emit('user', nicknames);
  });
  socket.on('user', (nickname) => { newUser(nickname, socket); nick = nickname; });
  socket.on('changeUser', (nickname) => { changeUser(nickname, nick); nick = nickname; });
});

const webChatController = require('./controllers/chatController');

app.set('view engine', 'ejs');

app.set('views', './views');

app.use(express.static(`${__dirname}/views/`));

app.use('/', webChatController);

http.listen(3000, () => {
  console.log('running on port 3000');
});