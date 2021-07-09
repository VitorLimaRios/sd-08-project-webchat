const crypto = require('crypto');
const messagesModel = require('../models/messagesModel');

// Referência: https://www.horadecodar.com.br/2020/05/13/como-formatar-data-no-javascript-date-moment-js/
const generateFormatedDate = () => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const onlineUsers = {};

const connectAndDisconectEvents = (io, socket) => {
  socket.on('userConnected', async () => {
    const randomUser = crypto.randomBytes(8).toString('hex');
    console.log(`ID: ${socket.id} / Nickname: ${randomUser} conectou à sala`);
    io.emit('saveStorage', { socketId: socket.id, nickname: randomUser });
    onlineUsers[socket.id] = randomUser;
    const onlineUsersArray = Object.values(onlineUsers);
    io.emit('onlineUsers', onlineUsersArray);
    const lastUserConnected = onlineUsersArray.pop();
    onlineUsersArray.unshift(lastUserConnected);
    socket.emit('onlineUsers', onlineUsersArray);
    const messageHistory = await messagesModel.getMessages();
    io.emit('history', messageHistory);
  });

  socket.on('disconnect', () => {
    console.log(`ID: ${onlineUsers[socket.id]} desconectou-se`);
    delete onlineUsers[socket.id];
    io.emit('onlineUsers', Object.values(onlineUsers));
  });
};

const messageEvents = (io, socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = generateFormatedDate();
    const message = `${date} - ${nickname}: ${chatMessage}`;
    console.log(`${date} - ${nickname}: ${chatMessage}`);
    io.emit('message', message);
    await messagesModel
      .saveMessage({ nickname, content: chatMessage, date });
  });
};

const nicknameEvents = (io, socket) => {
  socket.on('changeNickname', (newNickname) => {
    onlineUsers[socket.id] = newNickname;
    const onlineUsersArray = Object.values(onlineUsers);
    io.emit('onlineUsers', onlineUsersArray);
    const lastUserConnected = onlineUsersArray.pop();
    onlineUsersArray.unshift(lastUserConnected);
    socket.emit('onlineUsers', onlineUsersArray);
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  connectAndDisconectEvents(io, socket);

  messageEvents(io, socket);

  nicknameEvents(io, socket);  
});