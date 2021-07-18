const moment = require('moment');
const {
  chatModel: {
    writeMessage,
    // readMessages,
  },
} = require('./models');

let users = [];

const addUser = (socket, io) => {
  const { firstNickName: nick } = socket.handshake.query;
  const newUser = { nickname: nick, socketId: socket.id };
  users.push(newUser);
  console.log(`${newUser.nickname} se conectou`);
  socket.emit('connectionMaster', newUser);
  io.emit('connectionUsers', users);
};

const sendMessage = (io, socket) => {
  socket.on('message', async ({ nickname, chatMessage }) => {
    console.log(`${nickname} mandou uma mensagem`);
    const dateHour = moment().format('DD-MM-YYYY h:mm:ss A');
    await writeMessage({ message: chatMessage, nickname, timestamp: dateHour });
    io.emit('message', `${dateHour} - ${nickname}: ${chatMessage}`);
    io.emit('saveNickNameChat', nickname);
  });
};

const changeNickname = (nickname, socket) => users.forEach((user) => {
  const newUser = user;
  if (user.socketId === socket.id) {
    newUser.nickname = nickname;
    console.log(`${user.nickname} mudou o nickname`);
  }
});

const newNickName = (io, socket) => {
  socket.on('saveNickName', ({ nickname }) => {
    const { socketId } = users.filter((user) => user.nickname === nickname);
    const newUser = { nickname, socketId };
    changeNickname(nickname, socket);
    socket.emit('connectionMaster', newUser);
    io.emit('connectionUsers', users);
  });
};

const disconnectUser = (io, socket) => {
  socket.on('disconnect', () => {
    users.forEach((user) => {
      if (user.socketId === socket.id) console.log(`${user.nickname} se desconectou`);
    });
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit('connectionUsers', users);
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  addUser(socket, io);

  sendMessage(io, socket);

  newNickName(io, socket);

  disconnectUser(io, socket);
});
