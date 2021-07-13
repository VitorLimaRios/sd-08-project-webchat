// Faça seu código aqui
const express = require('express');
const cors = require('cors');
const randomstring = require('randomstring');

const app = express();
const http = require('http').createServer(app);

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET'],
  },
});

const chatModel = require('./models/chat');

const timestamp = () => {
  const date = new Date();
  const day = date.getDay();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  return `${day}-${month}-${year} ${hour}:${min}:${sec}`;
};

const randomNickname = () => {
  const nickname = randomstring.generate(16);
  return nickname;
};

const allUsers = {};
io.on('connection', (socket) => {
  let currentUser = randomNickname();
  allUsers[socket.id] = currentUser;

  socket.emit('userLocal', allUsers[socket.id]);

  io.emit('userList', Object.values(allUsers));

  socket.on('message', async ({ chatMessage, nickname = currentUser }) => {
    await chatModel.sendMessage({ chatMessage, nickname, timestamp: timestamp() });
    io.emit('message', `${timestamp()} ${nickname}: ${chatMessage}`);
  });
  socket.on('changeUser', (nickname) => {
    // Dica da Van: usar o filter para fazer um novo array respeitando o teste
    Object.values(allUsers).filter((e) => e !== allUsers[socket.id]);
    allUsers[socket.id] = nickname;
    currentUser = nickname;
    socket.emit('userLocal', allUsers[socket.id]);
    io.emit('userList', Object.values(allUsers));
  });
});

app.use(express.json());

const { chat } = require('./controllers/chat'); 

app.use(express.static(`${__dirname}/views`));
app.get('/', chat);

http.listen(3000, () => console.log('App listening on port 3000!'));
