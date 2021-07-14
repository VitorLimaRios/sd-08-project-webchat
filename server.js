const express = require('express');
const dateFormat = require('dateformat');

const now = Date.now();

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const messageModel = require('./models/messageModel');

const PORT = 3000;

const formatMessage = ({ time, nickname, message }) => (`${time} - ${nickname}: ${message}`);

app.use(bodyParser.json());
app.use(cors());

const usersList = [];

const history = async () => {
  const allMessages = await messageModel.findAllMessages();
  const eachMessage = await allMessages.map((elem) => 
    formatMessage({ time: elem.timestamp, nickname: elem.nickname, message: elem.message }));
  return eachMessage;
};

const userDisconnect = (socket, users) => {
  const userDiconnect = users.findIndex((user) => user.id === socket.id);
  usersList.splice(userDiconnect, 1);
};

const addUser = (user, socket) => {
  const socketId = socket.id;
  usersList.push({ user, socketId });
  if (usersList.length > 1) {
    io.emit('allUsers', usersList);
  } else {
    io.emit('user', user);
  }
};

const changeNickFunc = (data) => {
  const findUser = usersList.find((user) => user.socketId === data.socketId);
  findUser.user = data.user;
  io.emit('changeNickName', usersList);
};

function makeid(length, socket) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  usersList.push({ user: result, socketId: socket.id });
  return result;
} // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

const messageFormated = async (chatMessage, nickname) => {
  const timeNow = dateFormat(now, 'dd-mm-yyyy h:MM:ss TT');
  await messageModel.createMessage({ message: chatMessage, nickname, timestamp: timeNow });
  const value = formatMessage({ time: timeNow, nickname, message: chatMessage });
  return value;
};

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, '/public')));

io.on('connection', async (socket) => {
  // console.log(`connected ${socket.id}`);
  const historyAll = await history();
  io.emit('start', historyAll);

  socket.on('user', (user) => addUser(user, socket));

  socket.on('changeNickName', (data) => changeNickFunc(data));

  socket.on('message', async ({ chatMessage, nickname }) => {
    const value = await messageFormated(chatMessage, nickname);
    io.emit('message', value);
  });

  socket.on('disconnect', () => {
    userDisconnect(socket, usersList);
    io.emit('allUsers', usersList);
  });
});

app.get('/', async (_req, res) => {
  res.render('chat');
});

http.listen(PORT, () => console.log(`App listening ${PORT}`));