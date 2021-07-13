const users = [];
const addUser = (user) => {
  const checkUser = users.find(({ socketId }) => socketId === user.socketId);
  if (checkUser) {
    checkUser.nickname = user.nickname;
  } else { users.push(user); }
};

const removeUser = (user) => {
  const index = users.findIndex((e) => e.id === user.id);
  users.splice(index, 1);
};

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('newUser', (newUserName) => {
    const newUser = { nickname: newUserName, socketId: socket.id };
    addUser(newUser);
    io.emit('updateNickName', users);
  });
  socket.on('disconnect', () => {
    removeUser(socket);
    io.emit('updateNickName', users);
  });
});