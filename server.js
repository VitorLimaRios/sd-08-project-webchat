const express = require('express');

const app = express();
const http = require('http').createServer(app);

const OPTIONS = {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
};

const io = require('socket.io')(http, OPTIONS);

io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id}`); 
  console.log('*********************'); 
  console.log(socket); 
  console.log('*********************');
  socket.emit('ola', 'Mensagem descritiva');
  socket.on('ping', () => {
    console.log(`${socket.id} emitiu um ping!`);
    io.emit('pong', `${socket.id} enviou um pong!`);
  });
});

app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`));

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});