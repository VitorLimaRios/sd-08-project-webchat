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

const { create, getAll } = require('./models/messages');

const getTimestamp = () => {
  try {
    const time = moment().format('DD-MM-YYYY h:mm:ss A');
    return time;
  } catch (err) { console.error(err); }
};

const changePerson = (id, customPerson) => {
  try {
      person[id] = customPerson;
      io.emit('personListUpdate', person);
  } catch (err) { console.error(err); }
};

const disconnect = (id) => {
  try {
    delete person[id];
    io.emit('personListUpdate', person);
  } catch (err) { console.error(err); }
};

const message = async (nickname, chatMessage) => {
  try {
    const timestamp = getTimestamp();
    const content = `${timestamp} - ${nickname}: ${chatMessage}`;
    await create(chatMessage, nickname, timestamp);
    io.emit('message', content);
  } catch (err) { console.error(err); }
};

io.on('connection', async (client) => {
  try {
    person[client.id] = client.id.slice(0, 16);
    client.emit('setCurrentPerson', person[client.id]);
    io.emit('personListUpdate', person);
    const allMessages = await getAll();
    client.emit('listMessages', allMessages);
  } catch (err) { console.error(err); }

  client.on('message', ({ nickname, chatMessage }) => message(nickname, chatMessage));
  client.on('changePerson', (customPerson) => changePerson(client.id, customPerson));
  client.on('disconnect', () => disconnect(client.id));
});

app.use(cors());
app.use(express.static('public'));
app.get('/', (_req, res) => { res.render('index'); });
app.get('/test', (_req, res) => res.json({ message: 'Rodando liso!' }));
http.listen(PORT, () => console.log(`Rodando liso na porta ${PORT}`)); 
