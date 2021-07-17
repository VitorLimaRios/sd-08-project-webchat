const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);
const sockets = require('socket.io');
const moment = require('moment');

const chatController = require('./controllers/chatController');
const chatModel = require('./models/chatModel');

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

const findMessagens = async () => {
  const messages = await chatModel.getAll();  
  return messages;
};

const create = async (msg) => {
  const result = await chatModel.create(msg);
  return result;
};

io.on('connection', (socket) => {
  const nick = socket.id.substring(0, 16);
  io.emit('userNew', `${nick}`);  
  findMessagens().then((msg) => msg.map(({ message, nickname, timestamp }) => {
    const messages = `${timestamp} ${nickname} ${message}`;
    return socket.emit('historyMsg', messages);
  }));
  socket.on('update', (user) => {
    io.emit('updateUser', user, nick);
  });
  socket.on('message', ({ chatMessage, nickname }) => {    
    const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');
    create({ message: chatMessage, nickname, timestamp });
    const userResult = `${timestamp} - ${nickname}: ${chatMessage}`;
    io.emit('message', userResult);
  });  
  socket.on('disconnect', () => {
    io.emit('bye', `${nick}`);
  });
});   

http.listen(3000, () => console.log('Rodando na porta 3000.'));
