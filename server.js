const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const PORT = 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000/',
    method: ['GET', 'POST'],
  },
});

app.use(cors());

io.on('connection', (socket) => {
  // remover quem sair do chat
  socket.on('disconnect', (user) => {
    onlineUsers.splice(onlineUsers.indexOf(user), 1);
    io.emit('remover', onlineUsers);
  });

  aoInicializar(socket);
  // enviar mensagens do BD
  const menssagesArray = async () => {
    const savedMessages = await getMessagens();
    const eachMessage = savedMessages
      .map((msg) => `${msg.timestamp}-${msg.nickname}: ${msg.message}`);
    socket.emit('newConnection', eachMessage);
  };
  menssagesArray();

  // receber mensagens
  socket.on('message', async ({ chatMessage, nickname }) => {
    const timestamp = moment().format('DD-MM-YYYY hh:mm:ss A');

    // enviar mensagens
    sendMessage(timestamp, nickname, chatMessage);

    // salvar no DB
    salvaBD(chatMessage, nickname, timestamp);
  });
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/front-end/index.html`);
});

http.listen(PORT, () => {
  console.log(`Servidor rodando na ${PORT}`);
})