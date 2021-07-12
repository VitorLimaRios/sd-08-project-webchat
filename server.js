const express = require('express');

const app = express();
const http = require('http').createServer(app);

// const io = require('socket.io')(http, {
//   cors: {
//     origem: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//   },
// });

const PORT = 3000;
// const getDateAndHour = require('./helpers/getDateAndHour');
// const ChatMessage = require('./models/chatMessage');
// const ChatController = require('./controller/chatController');

app.use(express.json());
app.use(express.static(__dirname, +'public'));

http.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});