const bodyParser = require('body-parser');
const express = require('express');
const socketServer = require('socket.io');

const app = express();

const http = require('http').createServer(app);
const allowCors = require('./config/cors');

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(allowCors);
app.use(express.static(`${__dirname}/public`));

const homeWebChat = require('./controllers/routes');

app.use(homeWebChat);

const io = socketServer(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  // console.log(`${socket.id} entrou na sala`);
  socket.on('loggedInUser', (data) => {
    console.log(data);
  });
});

http.listen(PORT, () => console.log('Servidor ouvindo na porta 3000'));