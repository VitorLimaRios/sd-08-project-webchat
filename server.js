const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const viewsRoutes = require('./routes/viewsRoutes');
const messagesRoutes = require('./routes/messagesRoutes');
const messagesModel = require('./models/messagesModel');

let clients = [];

const startConnection = (socket) => {
  socket.on('newConnection', (nickname) => {
    const newUser = { nickname, id: socket.id };

    socket.broadcast.emit('newUser', newUser);
    clients = [...clients, newUser];
  });

  socket.on('newNickname', (nickname) => {
    socket.broadcast.emit('newNickname', { nickname, id: socket.id });
    const index = clients.findIndex((client) => client.id === socket.id);
    clients[index].nickname = nickname;
  });

  socket.on('disconnect', () => {
    const index = clients.findIndex((user) => user.id === socket.id);
    clients.splice(index, 1);
    socket.broadcast.emit('disconnected', socket.id);

    console.log('usuario desconectado');
  });
};

/* https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/replace
https://stackoverflow.com/questions/16970237/jquery-replace-g-do-not-work-for-me-but-others
*/
// inspirações para a função getDate abaixo

const getDate = () => {
  const date = new Date()
  .toLocaleString({}, { hour12: true })
  .replace(/\//g, '-');
  return date;
};

io.on('connection', (socket) => {
  console.log(`novo usuário conectado! ${socket.id}`);

  startConnection(socket);

  socket.emit('users', clients);

  socket.on('message', ({ chatMessage, nickname }) => {
    const date = getDate();
    const message = `${date} - ${nickname}: ${chatMessage}`;
    messagesModel.createMessage(chatMessage, nickname, date);
    io.emit('message', message);
  });
});

app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/views/`));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(viewsRoutes);
app.use(messagesRoutes);

const port = process.env.PORT || 3000;

http.listen(port, () => {
  console.log(`Usando a porta ${port}`);
});