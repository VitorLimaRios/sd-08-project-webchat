// Faça seu código aqui
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const OK = 200;
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cors());

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
});

const chatModels = require('./models/chatModels');
const chatControllers = require('./controllers/chatControllers');

io.on('connection', async (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id}`);
  const messages = await chatModels.getMessages();
  socket.emit('oldMessages', messages);
});

app.use(express.static(path.join(__dirname, '/public')));

require('./sockets/chat')(io);

app.get('/', (_req, res) => {
  res.status(OK).render('chat/index');
});

app.use('/', chatControllers);

http.listen(PORT, () => console.log(`Servidor aberto na porta ${PORT}.`));
