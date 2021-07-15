const express = require('express');
const path = require('path');
const moment = require('moment');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

const Messages = require('./models/messages');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'views')));

let users = [];

const shots = {
  connection: 'connection',
  message: 'message',
  newUser: 'new-user',
  updateUser: 'update-user',
  onlineUsers: 'online-users',
  disconnectUser: 'disconnect-user',
  disconnect: 'disconnect',
};

const handleDisplayMessage = async (chatMessage, nickname) => {
  const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');
  await Messages.createMessage({ message: chatMessage, nickname, timestamp });
  io.emit(shots.message, `${timestamp} - ${nickname}: ${chatMessage}`);
};

const handleDisconnectUser = (updatedClients) => {
  users = updatedClients;
  io.emit(shots.onlineUsers, users);
  io.emit(shots.disconnectUser);
};

io.on(shots.connection, (socket) => {
  socket.on(shots.newUser, (nickname) => {
    users.push({ id: socket.id, nickname });
    socket.broadcast.emit(shots.newUser, nickname);
  });

  socket.on(shots.onlineUsers, () => io.emit(shots.onlineUsers, users));

  socket.on(shots.message, ({ chatMessage, nickname }) => {
    handleDisplayMessage(chatMessage, nickname);
  });

  socket.on(shots.updateUser, (nickname) => {
    const idx = users.findIndex((user) => user.id === socket.id);
    users[idx].nickname = nickname;
    io.emit(shots.onlineUsers, users);
  });

  socket.on(shots.disconnect, () => {
    const allClients = users.filter((c) => c.id !== socket.id);
    handleDisconnectUser(allClients);
  });
});

app.get('/', async (_request, response) => {
  const messages = await Messages.getAllMessages();
  response.render('index', { messages });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));