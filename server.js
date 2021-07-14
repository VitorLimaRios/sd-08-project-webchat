const express = require('express');

const bodyParser = require('body-parser');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  }, 
});

const { updateMessagesRepository } = require('./models/MessagesRepository');

const router = require('./controllers/MessageController');

  const PORT = 3000;

  const generateDate = () => {
    const now = new Date();
      const day = now.getDate();
      const month = now.getMonth();
      const year = now.getFullYear();
      const hours = now.getHours();
      const min = now.getMinutes();
      const sec = now.getSeconds();
      return `${day}-${month}-${year} ${hours}:${min}:${sec}`;
  };

  let onlineUsers = [];

  const capureNickNameEvent = (socket) => {
    socket.on('nickName', (nickName) => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      onlineUsers = [...onlineUsers, { socketId: socket.id, nickname: nickName }];
      console.log('Conectou um cliente', onlineUsers);
      io.emit('onlineUsers', onlineUsers);
    });
  };

  io.on('connection', (socket) => {
    console.log(`novo usuário conectado! ${socket.id}`);
    socket.emit('confirmConnection');
   
    capureNickNameEvent(socket);

    const date = generateDate();

    socket.on('message', async ({ chatMessage, nickname }) => {
      console.log('Mensagem recebida pelo servidor', nickname);
      await updateMessagesRepository({ chatMessage, nickname, date });

      io.emit('message',
      `${date} ${nickname} ${chatMessage}`);
    });

    socket.on('disconnect', () => {
      onlineUsers = onlineUsers.filter((onlineUser) => onlineUser.socketId !== socket.id);
      console.log('Um cliente desconectou', onlineUsers);
      io.emit('clientExit', onlineUsers);
    });
  });

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/historicMessage', router);

http.listen(PORT, () => console.log('App listening on PORT %s', PORT));

app.get('/', (_req, res) => res.end());