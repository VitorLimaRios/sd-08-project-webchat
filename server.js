const express = require('express');
const cors = require('cors');
const randomNick = require('random-character');
const dateFormat = require('dateformat');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const makeChar = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const chatModel = require('./models/chatModel');

const chatUsers = {};
const date = dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT');

io.on('connection', (client) => { 
   chatUsers[client.id] = `User_${randomNick.randomChar(11)}`;
  client.emit('currentUser', chatUsers[client.id]);
  client.on('message', ({ nickname, chatMessage }) => {
    chatModel.insertMessage({ message: chatMessage, nickname, timestamp: date });
    const newMessage = `${date} - ${nickname}: ${chatMessage}`;
    io.emit('message', newMessage);
  });

  io.emit('userNickname', Object.values(chatUsers));
  client.on('changeNick', (nickname) => {
    Object.values(chatUsers).filter((e) => e !== chatUsers[client.id]);
    chatUsers[client.id] = nickname;
    client.emit('currentUser', chatUsers[client.id]);
    io.emit('userNickname', Object.values(chatUsers));
  });

  client.on('disconnect', () => {
    delete chatUsers[client.id];
    io.emit('userDisconnect', Object.values(chatUsers));
  });
});

app.use(express.json());
app.use(cors());
app.use(express.static(`${__dirname}/frontEnd`));

app.get('/messages', async (_req, res) => {
  try {
    const messages = await chatModel.getAllMessages();
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
  }
});

http.listen(3000, () => console.log('App listening on port 3000!'));
