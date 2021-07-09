const express = require('express');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  } });

// require('./sockets/webchat')(io);

const formattedDate = () => {
  const dateTimeNow = new Date();

  return `${dateTimeNow.getDate()}-`
  + `${dateTimeNow.getMonth() + 1}-`
  + `${dateTimeNow.getFullYear()} `
  + `${dateTimeNow.getHours()}:`
  + `${dateTimeNow.getMinutes()}`;
};

io.on('connection', (socket) => {
  console.log(`Usuário conectado com sucesso! SocketId: ${socket.id} `);

  socket.on('message', ({ chatMessage, nickname }) => {
    console.log(chatMessage);

    const message = `${formattedDate()} - ${nickname}: ${chatMessage}`;
    io.emit('message', message);
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});