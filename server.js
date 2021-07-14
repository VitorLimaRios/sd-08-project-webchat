const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET'],
  },
});

const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

io.on('connection', (socket) => {
  console.log('Alguém se conectou');

  socket.on('disconnect', () => {
    console.log('Connection closed');
  });

  socket.on('message', (msg) => {
    io.emit('serverMessage', { message: msg });
  });

  socket.emit('message', ('Bem vinde'));

  socket.broadcast.emit('serverMessage', { message: 'Nova conexão' });
});

// const WebchatController = require('./controllers/WebchatController');

app.get('/', (_req, res) => {
  // res.status(200).json({ ok: true });
  res.sendFile(__dirname + '/webchat.html');
});

// app.use('/languages', WebchatController);
// require('./sockets/votes')(io);

http.listen(PORT, () => {
  console.log('Listening on port %s', PORT);
});
