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

app.use(express.static(path.join(`${__dirname}/public`)));

io.on('connection', (socket) => {
  console.log('Client connected');
  const userLogged = [];

  socket.on('user', (user) => {
    userLogged.push(user);
    io.emit('user', user);
  });

  socket.on('chat', (msg) => {
    const array = userLogged.length;
    const nickname = userLogged[array - 1];
    const timeNow = dateFormat(now, 'dd-mm-yyyy h:MM:ss TT');
    const value = formatMessage({ time: timeNow, nickname, message: msg });
    io.emit('chat', value);
  });
});

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

http.listen(PORT, () => console.log(`App listening ${PORT}`));