const express = require('express');

const app = express();
// const cors = require('cors');
const path = require('path');
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});
    
const ChatController = require('./controllers/chatController');

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'views')));

const clients = [];

io.on('connection', (socket) => {
  socket.on('newUser', (nickname) => {
    clients.push({ userId: socket.id, nickname });
    // console.log(clients, "clients")
    socket.broadcast.emit('newUser', nickname);
  });
  
  socket.on('onlineUsers', () => io.emit('onlineUsers', clients));
});

app.get('/', async (_req, res) => { 
    const messages = await ChatController.getAll();
  res.render('index', { messages });
});

const PORT = process.env.PORT || 3000;  

http.listen(PORT, () => {
  console.log(`Running server on port ${PORT}`);
});