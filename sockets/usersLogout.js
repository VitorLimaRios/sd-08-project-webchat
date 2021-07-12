const usersModel = require('../models/usersModel');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('disconnect', async () => {
      console.log(`User Disconnected! ID: ${socket.id}`);
      await usersModel.removeUser(socket.id);
      socket.broadcast.emit('updateUsers');
    });
  });
};
