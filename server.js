const express = require('express');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origem: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = 3000;
const { getDateAndHour } = require('./helpers/getDateAndHour');
const ChatMessage = require('./models/chatMessage');
const ChatController = require('./controller/chatController');

app.use(express.json());
app.use(express.static(__dirname, +'public'));

const onlineUsers = {};
let nickNames = [];

const messageHandler = async (message) => {
  const messageFormater = `${getDateAndHour} ${message.nickName} ${message.ChatMessage}`;
  io.emit('message', messageFormater);
  const result = await ChatMessage
    .createChatMessage(message.ChatMessage, message.nickName, getDateAndHour);
  return result;
};

const nickNameHandler = ({ nickName }, socket) => {
  if (!nickNames.includes(nickName)) {
    if (onlineUsers[socket.id] && onlineUsers[socket.id] !== nickName) {
      nickNames = nickNames.filter((item) => item !== onlineUsers[socket.id]);
    }
    nickNames.push(nickName);
    onlineUsers[socket.id] = nickName;
    io.emit('updateNickNames', { nickNames });
  }
};

const disconnectHandler = (socket) => {
  const user = onlineUsers[socket.id];
  if (user) {
    nickNames = nickNames.filter((item) => item !== user);
    onlineUsers[socket.id] = undefined;
    io.emit('udpateNickNames', { nickNames });
  }
};

io.on('connection', (socket) => {
  socket.on('nickName', (message) => nickNameHandler(message, socket));
  socket.on('message', messageHandler);
  socket.on('disconnect', () => disconnectHandler(socket));
});

app.get('/messages', ChatController.getChatMessage);

http.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});