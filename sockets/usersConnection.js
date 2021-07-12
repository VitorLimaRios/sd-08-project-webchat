const usersModel = require('../models/usersModel');
const { getRandomNickname } = require('../services/randomNickname');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected! ID: ${socket.id}`);

    const randomNickname = getRandomNickname(socket.id);
    socket.emit('yourNickname', randomNickname);

    socket.on('getUsers', async (nickname) => {
      const usersOnline = await usersModel.getUsers();
      socket.emit('usersOnline', usersOnline);
      if (nickname) {
        socket.broadcast.emit('newUser', nickname);
        await usersModel.createUser({ nickname, socketId: socket.id });
      }
    });

    socket.on('updateNickname', async (nickname) => {
      await usersModel.updateUser(socket.id, nickname);
      const usersOnline = await usersModel.getUsers();
      io.emit('usersOnline', usersOnline);
    });
  });
};
