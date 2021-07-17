const express = require('express');
const moment = require('moment');
const cors = require('cors');
const something = require('random-name'); // Referência Thays Costa

const app = express();
const http = require('http').createServer(app);
require('dotenv').config();

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;
const person = {};

const timestamp = () => {
  const time = moment().format('DD-MM-YYYY h:mm:ss A');
  return time;
};

io.on('connection', (client) => {
  const { id } = client;
  
  person[id] = something().slice(0, 16);
  client.emit('currentUser', person[id]);
  
  const newUser = person[id];
  console.log(`${newUser} joined chat at ${timestamp()}`);
  client.emit('enter', (newUser));
  
  client.on('message', ({ nickname, chatMessage }) => {
    const content = `${timestamp()} - ${nickname}: ${chatMessage}`;
    io.emit('message', content);
  });
  
  client.on('disconnect', () => {
    const disconnected = person[id];
    console.log(`${disconnected} left chat at ${timestamp()}`);
    delete person[id];
    io.emit('exit', disconnected);
  });
});

app.use(cors());
// app.use(express.static(`${__dirname}/public`));

http.listen(PORT, () => console.log('Rodando liso na porta', PORT)); 
