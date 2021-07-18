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

// const { saveMessage, fetchMessages } = require('./models/messages');

const getTimestamp = () => {
  try {
    const time = moment().format('DD-MM-YYYY h:mm:ss A');
    return time;
  } catch (err) { console.error(err); }
};

/* const disconnect = (client) => {
  try {
    const { id } = client;
    const disconnectedPerson = person[id];
    io.emit('exit', disconnectedPerson);
    delete person[id];
    io.emit('personList', person);
    // console.log(`${disconnectedPerson} left at ${timestamp}`);
  } catch (err) { console.error(err); }
}; */

const message = /* async */ (nickname, chatMessage) => {
  try {
    const timestamp = getTimestamp();
    const content = `${timestamp} - ${nickname}: ${chatMessage}`;
    // await saveMessage(chatMessage, nickname, timestamp);
    io.emit('message', content);
    // console.log(`${nickname} sent a message at ${timestamp}`);
  } catch (err) { console.error(err); }
};

io.on('connection', /* async */ (client) => {
  try {
    const { id } = client;
    person[id] = id.slice(0, 16);
    client.emit('setCurrentPerson', person[id]);
    io.emit('personList', person);
    // const allMessages = await fetchMessages();
    // client.emit('listMessages', allMessages);
    // console.log(`${person[id]} joined at ${timestamp}`);
  } catch (err) { console.error(err); }

  client.on('message', ({ nickname, chatMessage }) => message(nickname, chatMessage));

/*   client.on('changePerson', (customPerson) => {
    try {
      const { id } = client;
      person[id] = customPerson;
      io.emit('personList', person);
    } catch (err) { console.error(err); }
  }); */

  // client.on('disconnect', () => disconnect(client));
});

app.use(cors());
app.use(express.static('public'));
app.get('/', (_req, res) => { res.render('index'); });
app.get('/test', (_req, res) => res.json({ message: 'Rodando liso!' }));
http.listen(PORT, () => console.log(`Rodando liso na porta ${PORT}`)); 
