const express = require('express');

const app = express();

const path = require('path');

const http = require('http').createServer(app);

const cors = require('cors');

app.use(cors());

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET'],
  },
});

app.use(express.static(path.join(__dirname, '/public')));

require('./sockets/chat')(io);

const PORT = 3000;

app.get('/', (req, res) => {
  console.log('oi');
  return res.sendFile(path.join(__dirname, '/index.html'));
});

http.listen(PORT, () => console.log(`ouvindo porta ${PORT}`));