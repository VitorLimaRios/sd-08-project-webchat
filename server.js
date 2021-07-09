const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

app.use(cors());
app.set('view engine', 'ejs');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

const currentData = () => {
  let today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  const hour = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();
  today = `${month}-${day}-${year} ${hour}:${minutes}:${seconds}`;

  return today;
};

const messageListener = (socket) => {
  socket.on('message', async (message) => {
    const timestamp = currentData();
    io.emit('message', `${timestamp}-${message.nickname}: ${message.chatMessage}`); 
  });
};

io.on('connection', async (socket) => {
  console.log('CONECTADO');
  messageListener(socket);
});

const PORT = 3000;

http.listen(PORT, () => console.log('RODANDO'));