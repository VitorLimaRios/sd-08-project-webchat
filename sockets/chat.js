const chatModels = require('../models/chatModels');
const { removingUser, addUser, getAll, updateUser } = require('./users');

const addZero = (date) => {
  if (date <= 9) return `0${date}`;
  return date;
};

const nowDate = () => {
  const today = new Date(Date.now());
    const date = `${addZero(today.getDate().toString())}-${addZero((today.getMonth() + 1)
      .toString())}-${addZero(today.getFullYear().toString())}`;
    const time = `${today.getHours()}:${addZero(today
      .getMinutes())}:${addZero(today.getSeconds())}`;
    return `${date} ${time}`;
};

const messageConfig = async (nickname, chatMessage) => {
  const timestamp = nowDate();
    const postMessage = `${timestamp} - ${nickname}: ${chatMessage}`;
    await chatModels.writeMessage(chatMessage, nickname, timestamp);
    return postMessage;
};

const userConnect = (socket, userName) => {
  addUser(socket.id, userName);
  socket.broadcast.emit('userConnect', userName);
  socket.emit('otherUsers', getAll());
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', async ({ nickname, chatMessage }) => {
      const postMessage = await messageConfig(nickname, chatMessage);
      io.emit('message', postMessage);
    });
    socket.emit('connection');
    socket.on('updateUsers', ({ oldUser, newUser }) => {
      const newUsers = updateUser(oldUser, newUser);
      socket.broadcast.emit('updateUsers', newUsers);
    });
    socket.on('userConnect', (userName) => userConnect(socket, userName));
    socket.on('disconnect', () => {
      removingUser(socket.id);
      socket.broadcast.emit('disconnectUser', getAll());
    });
  });
};

// Reference: https://blog.betrybe.com/javascript/javascript-date-format/

// socket.on('users', (users) => io.emit('users', users));