/* eslint-disable max-lines-per-function */
const chatModel = require('../models/chat');

const getFinalMessage = (nickname, chatMessage) => {
  const date = new Date();
      const day = date.getDate();
      const month = (date.getMonth() + 1);
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      
      const incZero = (n) => (n < 10 ? `0${n}` : n); 

      const dateNow = `${incZero(day)}-${incZero(month)}-${year}`;
      const timeNow = `${hours}:${incZero(minutes)}:${incZero(seconds)}`;

      const timestamp = `${dateNow} ${timeNow}`;
      const finalMessage = { timestamp, nickname, chatMessage };

      return {
        finalMessage,
        timestamp,
      };
};

const userList = [];

const addUser = (user) => {
  const userExists = userList.find(({ id }) => id === user.id);

    if (userExists) {
    const oldNickname = userExists.nickname;
    userExists.nickname = user.nickname;
    return {
      oldNickname,
      nickname: userExists.nickname,
    };
  } 
    userList.push(user);
    return false;
};

const findNickname = (id) => userList.find((e) => e.id === id);
const removeUser = (id) => {
  const index = userList.findIndex((e) => e.id === id);
  return userList.splice(index, 1);
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('userConnected', (userData) => {
      const user = { ...userData, id: socket.id };
      const newUser = addUser(user);
      if (newUser) {
        const { nickname, oldNickname } = newUser;
        const nickMessage = `User ${oldNickname} changed nickname to ${nickname}`;
        socket.broadcast.emit('userChangedNickname', nickMessage);
      } else {
        const userInMessage = `User ${userData.nickname} just connected to chat`;
        socket.broadcast.emit('newUserIn', userInMessage);
      }
      io.emit('userList', userList);
    });

    socket.on('disconnect', () => {
      const { id } = socket;
      const usrNickname = findNickname(id);
      removeUser(id);
      io.emit('userList', userList);
      if (usrNickname) {
        const usrDisconectMessage = `${usrNickname.nickname} is disconnected`;
        socket.broadcast.emit('userJustDisconnect', usrDisconectMessage);
      }
    });

    socket.on('message', async ({ nickname, chatMessage }) => {
      const { finalMessage, timestamp } = getFinalMessage(nickname, chatMessage);

      await chatModel.create({ nickname, chatMessage, timestamp });

      socket.broadcast.emit('message', finalMessage);
    });
  });
};