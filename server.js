// Faça seu código aqui
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));

io.on('connect', (socket) => {
  console.log(`User connected! ID: ${socket.id}`);
});

app.get('/', (_req, res) => {
  res.send('hello');
});

const PORT = 3000;

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
