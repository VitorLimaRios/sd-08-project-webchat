const express = require('express');

const app = express();
const http = require('http').createServer(app);
require('dotenv').config();

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const messagesController = require('./controllers/messagesController');

io.sockets.on('connection', (socket) => {
  console.log(`New user connected. ID: ${socket.id}`);
});

require('./sockets/chat')(io);

app.set('view engine', 'ejs');
app.set('views', './public/views');
app.use(express.static(`${__dirname}/public`));

app.get('/', messagesController.chatHistory);

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => console.log(`Port: ${PORT}`));
