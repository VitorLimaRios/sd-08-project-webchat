const express = require('express');

const bodyParser = require('body-parser');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  } });

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

  io.on('connection', (socket) => {
    console.log(`novo usuário conectado! ${socket.id}`);

    socket.emit('confirmConnection');

    socket.on('message', ({ chatMessage, nickname }) => {
      io.emit('message',
      `${generateDate()} ${nickname} ${chatMessage}`);
    });
  });

  app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

http.listen(PORT, () => console.log('App listening on PORT %s', PORT));

app.get('/', (_req, res) => res.end());