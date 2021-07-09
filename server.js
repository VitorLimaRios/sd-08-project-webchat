const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')));

io.on('connect', async (socket) => {
  console.log(`User connected! ID: ${socket.id}`);
  socket.emit('userConection');
});

require('./sockets/index')(io);

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

const PORT = 3000;

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
