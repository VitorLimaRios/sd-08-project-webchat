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

      const finalMessage = `${dateNow} ${timeNow} ${nickname}: ${chatMessage}`;
      const timestamp = `${dateNow} ${timeNow}`;

      return {
        finalMessage,
        timestamp,
      };
};

const userList = [];

const addUser = (user) => {
  const userExists = userList.find(({ id }) => id === user.id);

  if (userExists) {
    userExists.nickname = user.nickname;
  } else {
    userList.push(user);
  }
};

const removeUser = (id) => {
  const index = userList.findIndex((e) => e.id === id);

  userList.splice(index, 1);
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('userConnected', (userData) => {
      const user = { ...userData, id: socket.id };
      addUser(user);
      io.emit('userList', userList);
    });

    socket.on('disconnect', () => {
      const { id } = socket;
      removeUser(id);
      io.emit('userList', userList);
    });

    socket.on('message', async ({ nickname, chatMessage }) => {
      const { finalMessage, timestamp } = getFinalMessage(nickname, chatMessage);

      await chatModel.create({ nickname, chatMessage, timestamp });

      io.emit('message', finalMessage);
    });
  });
};