const moment = require('moment');
const {
  chatModel: {
    writeMessage,
    // readMessages,
  },
} = require('./models');

let users = [];

const addUser = async (socket, io) => {
  const { firstNickName: nick } = socket.handshake.query;
  const newUser = { nickname: nick, socketId: socket.id };
  users.push(newUser);
  console.log(`${newUser.nickname} se conectou`);
  await socket.emit('connectionMaster', newUser);
  await io.emit('connectionUsers', users);
};

const sendMessage = (io, socket) => {
  socket.on('message', async ({ nickname, chatMessage }) => {
    console.log(`${nickname} mandou uma mensagem`);
    const dateHour = moment().format('DD-MM-YYYY h:mm:ss A');
    await writeMessage({ message: chatMessage, nickname, timestamp: dateHour });
    await io.emit('saveNickNameChat', nickname);
    await io.emit('message', `${dateHour} - ${nickname}: ${chatMessage}`);
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
  socket.on('saveNickName', async ({ nickname }) => {
    const { socketId } = users.filter((user) => user.nickname === nickname);
    const newUser = { nickname, socketId };
    changeNickname(nickname, socket);
    await socket.emit('connectionMaster', newUser);
    await io.emit('connectionUsers', users);
  });
};

const disconnectUser = (io, socket) => {
  socket.on('disconnect', async () => {
    users.forEach((user) => {
      if (user.socketId === socket.id) console.log(`${user.nickname} se desconectou`);
    });
    users = users.filter((user) => user.socketId !== socket.id);
    await io.emit('connectionUsers', users);
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  addUser(socket, io);

  sendMessage(io, socket);

  newNickName(io, socket);

  disconnectUser(io, socket);
});
