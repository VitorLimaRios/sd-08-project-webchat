const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

require('./sockets/chat')(io);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.render('client', {
    title: 'TrybeChat',
    messages: [{ message: 'oi', timestamp: '17/07/2021', nickname: 'Fefe' }],
    userList: [{ connectId: 1, nickname: 'Fefe' }],
  }));
app.use('/', express.static(`${__dirname}/public`));
app.use('/public', express.static('public'));

const port = 3000;

http.listen(port, () => {
  console.log(`Usando a porta ${port}`);
});