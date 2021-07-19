const express = require('express');
const http = require('http');
const cors = require('cors');
const io = require('socket.io');
const moment = require('moment');

const { insertNewMessage, getMessages } = require('./models/Messages');

const app = express();
const httpServer = http.createServer(app);

const socket = io(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

app.use(cors());

let people = [];

const onMessage = async ({ nickname, chatMessage }) => {
  const date = moment().format('DD-MM-yyyy HH:mm:ss');
  await insertNewMessage({ message: chatMessage, nickname, timestamp: date });
  socket.emit('message', `${date} ${nickname} ${chatMessage}`);
};

socket.on('connection', async (socketParam) => {
  const { nickname: name } = socketParam.handshake.query;
  people.push({ name, socketParam });

  socket.emit('conn', { name, onUsers: people.map((person) => person.name) });

  socketParam.on('disconnect', () => {
    people = people.filter((person) => person.socketParam !== socketParam);
    socket.emit('changeNick', { onUsers: people.map((person) => person.name) });
  });

  socketParam.on('message', onMessage);

  socketParam.on('changeNick', ({ newNick, nickname }) => {
    people = people.map((person) => (
      person.name === nickname ? ({ name: newNick, socketParam }) : person));

    socket.emit('changeNick', { onUsers: people.map((person) => person.name) });
  });

  const messages = await getMessages();
  const formattedMsgs = messages.map(
    ({ message, nickname, timestamp }) => `${timestamp} ${nickname} ${message}`,
  );

  socketParam.emit('storedMessages', formattedMsgs);
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

httpServer.listen(3000, () => {
  console.log('O pai ta on na 3000');
});