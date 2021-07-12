/* eslint-disable max-lines-per-function */
const usersModel = require('../models/usersModel');
const { formatDate } = require('../services/formatDate');
const { getRandomNickname } = require('../services/randomNickname');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected! ID: ${socket.id}`);

    const randomNickname = getRandomNickname();
    socket.emit('yourNickname', randomNickname);

    socket.on('getUsers', async (nickname) => {
      const usersOnline = await usersModel.getUsers();
      socket.emit('usersOnline', usersOnline);
      if (nickname) {
        socket.broadcast.emit('newUser', nickname);
        await usersModel.createUser({ nickname, socketId: socket.id });
      }
    });

    socket.on('message', ({ chatMessage, nickname }) => {
      const date = formatDate(new Date(Date.now()));

      const messageFormatted = `${date} - ${nickname}: ${chatMessage}`;
      io.emit('message', messageFormatted);
    });

    socket.on('disconnect', async () => {
      console.log(`User Disconnected! ID: ${socket.id}`);
      await usersModel.removeUser(socket.id);
      socket.broadcast.emit('updateUsers');
    });
  });
};
