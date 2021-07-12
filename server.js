const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);
const sockets = require('socket.io');
const userNew = require('./utils/nameRandom');

const chatController = require('./controllers/chatController');

const io = sockets(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(`${__dirname}/views`));

app.get('/', chatController.getAll);

io.on('connection', (socket) => {
  io.emit('userNew', `${userNew()}`);

  socket.on('message', ({ chatMessage, nickname }) => {
    const data = new Date();
    const date = data.toLocaleString().replace('/', '-').replace('/', '-');
    const userResult = `${date} - ${nickname}: ${chatMessage}`;
    io.emit('message', userResult);
  });
  
  socket.on('disconnect', () => {
    io.emit('bye', `${userNew()}`);
  });
  // socket.on('nome', (msg) => {
  //   io.emit('message', `${msg.nome} acabou de entrar.`)   
  // });
});   

http.listen(3000, () => console.log('Rodando na porta 3000'));
