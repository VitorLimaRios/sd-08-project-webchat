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

const PORT = 3000;

const formatMessage = ({ time, nickname, message }) => (`${time} - ${nickname}: ${message}`);

app.use(bodyParser.json());
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, '/public')));

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('user', (user) => {
    io.emit('user', user);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const timeNow = dateFormat(now, 'dd-mm-yyyy h:MM:ss TT');
    const value = formatMessage({ time: timeNow, nickname, message: chatMessage });
    io.emit('message', value);
  });
});

app.get('/', async (_req, res) => {
  // res.sendFile(path.join(__dirname, 'index.html'));
  res.status(200).render('../views/chat.ejs');
});

http.listen(PORT, () => console.log(`App listening ${PORT}`));