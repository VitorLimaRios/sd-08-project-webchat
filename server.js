const moment = require('moment');
const express = require('express');

const app = express();
const path = require('path');
const http = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET'],
  },
});

const userChat = require('./models/userChat');

let allUsers = [];

const updateNickname = async (prevNickname, newNickname) => {
  const { _id: id } = await userChat.getByName(prevNickname);
  allUsers = allUsers.filter((user) => user !== prevNickname);
  allUsers.push(newNickname);
  await userChat.updateNickName(id, newNickname);
};

const messageSent = async (chatMessage, nickname) => {
  const message = `${moment().format('DD-MM-YYYY HH:mm:ss')} - ${nickname}: ${chatMessage}`;
  await userChat.addMessage(message);
  return message;
};

const addNewUser = async (newUser) => {
  await userChat.addUser(newUser);
  allUsers.push(newUser);
};

io.on('connection', async (client) => {
  let newUser = `User_${client.id.slice(0, 11)}`;
  await addNewUser(newUser);
  client.emit('user', newUser);
  io.emit('usersOnline', allUsers);
  io.emit('chat', await userChat.getAllMessages());

  client.on('updateNickName', async ({ prevNickname, newNickname }) => {
    await updateNickname(prevNickname, newNickname);
    newUser = newNickname;
    io.emit('usersOnline', allUsers);
  });

  client.on('message', async ({ chatMessage, nickname }) => {
    const message = await messageSent(chatMessage, nickname);
    io.emit('message', message);
  });
  
  client.on('disconnect', () => {
    allUsers = allUsers.filter((user) => user !== newUser);
    client.broadcast.emit('usersOnline', allUsers);
  });
});

const PORT = 3000;

app.use(express.static(path.join(__dirname, '/views')));
app.use(bodyParser.json());
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views'); 

app.get('/', (req, res) => {
  res.render('home.ejs');
});

http.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
