const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const chatController = require('./controllers/chatController');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.json());
app.use(cors());

require('./sockets/chat')(io);

io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id} `);
  socket.on('disconnect', () => {
    console.log(`Usuário desconectado. ID: ${socket.id}`);
  });
});

app.get('/', chatController);

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
