const express = require('express');

const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const chatController = require('./controllers/chatController');

require('./sockets/chatSocket')(io);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

app.get('/', chatController.get);

http.listen(3000, () => { console.log('Ouvindo na porta 3000'); });