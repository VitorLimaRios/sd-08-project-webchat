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
  
  const joinedPerson = person[id];
  
  console.log(`${joinedPerson} joined chat at ${timestamp()}`);
  
  client.on('message', ({ nickname, chatMessage }) => {
    const content = `${timestamp()} - ${nickname}: ${chatMessage}`;
    console.log(`${nickname} sent a message at ${timestamp()}`);
    io.emit('message', content);
  });
  
   client.on('disconnect', () => {
    const disconnectedPerson = person[id];
    delete person[id];
    console.log(`${disconnectedPerson} left chat at ${timestamp()}`);
  });
});

app.use(cors());
http.listen(PORT, () => console.log('Rodando liso na porta', PORT)); 
