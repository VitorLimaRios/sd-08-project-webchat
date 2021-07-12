const { getRandomNickname } = require('../services/randomNickname');

const onlineUsers = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected! ID: ${socket.id}`);
    const randomNickname = getRandomNickname(socket.id);
    Object.assign(onlineUsers, { [socket.id]: randomNickname });
    socket.emit('yourNickname', randomNickname);
    socket.broadcast.emit('newUser', randomNickname);

    socket.on('getUsers', () => {
      socket.emit('usersOnline', onlineUsers);
    });

    socket.on('updateNickname', async (nickname) => {
      onlineUsers[Object.keys(onlineUsers).filter((e) => e === socket.id)] = nickname;
      socket.broadcast.emit('updatedUsers', onlineUsers);
    });

    socket.on('disconnect', async () => {
      delete onlineUsers[socket.id];
      io.emit('updatedUsers', onlineUsers);
    });
  });
};
