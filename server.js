const express = require('express');
const cors = require('cors');

const app = express();
const path = require('path');
const http = require('http').createServer(app);

app.use(express.static(path.join(__dirname, './public')));
const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const moment = require('moment');
const router = require('./src/routes');

app.set('view engine', 'ejs');
app.set('views', './public/views');
app.use(cors());
app.use(router);

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});

const { saveMessages } = require('./src/models/messages');
const { userJoin, getOnlineUsers, userLeave } = require('./src/utils/handleUsers');

const timestamp = () => moment().format('DD-MM-YYYY hh:mm:ss');
  io.on('connection', (socket) => {
    socket.on('message', async ({ chatMessage, nickname }) => {
      io.emit('message', `${timestamp()} - ${nickname}: ${chatMessage}`);
      saveMessages(chatMessage, nickname, timestamp());
    });
    socket.on('joinRoom', (nickname) => {
      userJoin(socket.id, nickname);
      io.emit('onlineUsers', getOnlineUsers());
    });
    socket.on('changNickname', (nickname) => {
      userLeave(socket.id);
      userJoin(socket.id, nickname);
      io.emit('onlineUsers', getOnlineUsers());
    });
    socket.on('disconnect', () => {
      userLeave(socket.id);
      io.emit('onlineUsers', getOnlineUsers());
    });
  });
