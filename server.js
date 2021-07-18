const express = require('express');
const moment = require('moment');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const person = {};

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { saveMessage, fetchMessages } = require('./models/messages');

const timestamp = () => {
  const time = moment().format('DD-MM-YYYY h:mm:ss A');
  return time;
};

const disconnect = (client) => {
  const disconnectedPerson = person[client.id];
  io.emit('exit', disconnectedPerson);
  delete person[client.id];
  io.emit('personList', person);
  console.log(`${disconnectedPerson} left chat at ${timestamp()}`);
};

const message = async (nickname, chatMessage) => {
  const content = `${timestamp()} - ${nickname}: ${chatMessage}`;
  await saveMessage(chatMessage, nickname, timestamp());
  io.emit('message', content);
};

io.on('connection', async (client) => {
  const { id } = client;
  person[id] = id.slice(0, 16);
  client.emit('setCurrentPerson', person[id]);
  io.emit('personList', person);
  const allMessages = await fetchMessages();
  client.emit('listMessages', allMessages);

  client.on('message', ({ nickname, chatMessage }) => message(nickname, chatMessage));

  client.on('changePerson', (customPerson) => {
    person[id] = customPerson;
    io.emit('personList', person);
  });

  client.on('disconnect', () => disconnect(client));
});

app.use(cors());
app.use(express.static(`${__dirname}/public`));
http.listen(PORT, () => console.log('Rodando liso na porta', PORT)); 
