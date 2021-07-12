const express = require('express');
const dateFormat = require('dateformat');

const now = Date.now();

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const messageModel = require('./models/messageModel');

const PORT = 3000;

const formatMessage = ({ time, nickname, message }) => (`${time} - ${nickname}: ${message}`);

app.use(bodyParser.json());
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, '/public')));

io.on('connection', async (socket) => {
  console.log('Client connected');

  const allMessages = await messageModel.findAllMessages();
  const eachMessage = await allMessages.map((elem) => 
    formatMessage({ time: elem.timestamp, nickname: elem.nickname, message: elem.message }));  
  io.emit('start', eachMessage);

  socket.on('user', (user) => {
    io.emit('user', user);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const timeNow = dateFormat(now, 'dd-mm-yyyy h:MM:ss TT');
    await messageModel.createMessage({ message: chatMessage, nickname, timestamp: timeNow });
    const value = formatMessage({ time: timeNow, nickname, message: chatMessage });
    io.emit('message', value);
  });
});

app.get('/', async (_req, res) => {
  res.status(200).render('../views/chat.ejs');
});

http.listen(PORT, () => console.log(`App listening ${PORT}`));