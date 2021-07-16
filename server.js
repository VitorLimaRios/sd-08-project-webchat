// Faça seu código aqui
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

io.on('connection', async (client) => {
  const newUser = `User_${client.id.slice(0, 11)}`;
  await userChat.addUser(newUser);

  client.emit('user', newUser);
  io.emit('usersOnline', await userChat.getAll());

  client.on('updateNickName', async ({ prevNickname, newNickname }) => {
    const { id } = await userChat.getByName(prevNickname);
    await userChat.updateNickName(id, newNickname);
    const newUsers = await userChat.getAll();
    io.emit('usersOnline', newUsers);
  });

  client.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${moment().format('DD-MM-YYYY HH:mm:ss')} - ${nickname}: ${chatMessage}`);
  });
});

const PORT = 3000;

app.use(express.static(path.join(__dirname, '/views')));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.render('home.ejs');
});

http.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
