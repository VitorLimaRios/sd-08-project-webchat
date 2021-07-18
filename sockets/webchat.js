const moment = require('moment');
const MessageModel = require('../models/Message');

const usersArray = [];

const changeNickname = (nick, socket) => {
  socket.broadcast.emit('changeNickname', nick);
    const newValue = usersArray.findIndex((user) => user.id === socket.id);
    usersArray[newValue] = { nickname: nick.nickNew, id: socket.id };
};

const serverMessage = (nickname, socket) => {
  socket.broadcast.emit('serverMessage', nickname);
  usersArray.push({ nickname, id: socket.id });
};

const disconnect = (socket) => {
  const index = usersArray.findIndex((user) => user.id === socket.id);
  console.log(index);
  if (index !== -1) {
    socket.broadcast.emit('deleteNickname', usersArray[index].nickname);
    usersArray.splice(index, 1);
  }
  console.log(usersArray);
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.emit('connection', usersArray);
    socket.on('users', (users) => io.emit('users', users));

    socket.on('teste', async () => {
      const historicoMsgs = await MessageModel.getAll();
      historicoMsgs.forEach((message) => {
        socket.emit('message', `${message.timestamp} - ${message.nickname}: ${message.message}`);
      });
    });

    socket.on('message', async ({ nickname, chatMessage }) => {
      const dateMsg = moment().format('DD-MM-yyyy HH:mm:ss');
      await MessageModel.create(chatMessage, nickname, dateMsg);
      io.emit('message', `${dateMsg} - ${nickname}: ${chatMessage}`);
    });

    socket.on('disconnect', () => disconnect(socket));
    socket.on('serverMessage', (nickname) => serverMessage(nickname, socket));
    socket.on('changeNickname', (nick) => changeNickname(nick, socket));
  });
};
