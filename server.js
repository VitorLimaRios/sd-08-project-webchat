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
  const { id } = client;
  const disconnectedPerson = person[id];
  io.emit('exit', disconnectedPerson);
  delete person[id];
  io.emit('personList', person);
  console.log(`${disconnectedPerson} left at ${timestamp()}`);
};

const message = async (nickname, chatMessage) => {
  const content = `${timestamp()} - ${nickname}: ${chatMessage}`;
  await saveMessage(chatMessage, nickname, timestamp());
  io.emit('message', content);
  console.log(`${nickname} sent a message at ${timestamp()}`);
};

io.on('connection', async (client) => {
  const { id } = client;
  person[id] = id.slice(0, 16);
  client.emit('setCurrentPerson', person[id]);
  io.emit('personList', person);
  const allMessages = await fetchMessages();
  client.emit('listMessages', allMessages);
  console.log(`${person[id]} joined at ${timestamp()}`);

  client.on('message', ({ nickname, chatMessage }) => message(nickname, chatMessage));

  client.on('changePerson', (customPerson) => {
    person[id] = customPerson;
    io.emit('personList', person);
  });

  client.on('disconnect', () => disconnect(client));
});

app.use(cors());
app.use(express.static('public'));
app.get('/', (_req, res) => { res.render('index'); });
app.get('/test', (_req, res) => res.json({ message: 'Rodando liso!' }));
http.listen(PORT, () => console.log(`Rodando liso na porta ${PORT}`)); 
