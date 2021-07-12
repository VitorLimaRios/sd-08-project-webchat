// Faça seu código aqui
const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET'],
  },
});

// const chatModel = require('./models/chat');
const timestamp = () => {
  const date = new Date();
  const day = date.getDay();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  return `${day}-${month}-${year} ${hour}:${min}:${sec}`;
};

io.on('connection', (socket) => {
  socket.on('welcome', () => {
    socket.emit('welcomeReposta', 'Vc chegou aqui.');
  });
  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${timestamp()} ${nickname}: ${chatMessage}`);
    // chatModel.sendMessage(chatMessage);
  });
});

app.use(express.json());

const { chat } = require('./controllers/chat'); 

app.use(express.static(`${__dirname}/views`));
app.get('/', chat);

http.listen(3000, () => console.log('App listening on port 3000!'));
