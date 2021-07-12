const onlineUsers = [];

const randomUser = () => {
  let result = '';
  const characters = '0123456789';
  let cLength = characters.length;
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * cLength));
  }
  return 'User' + result;
}

module.exports = (io) => io.on('connection', (socket) => {
  socket.guest = randomUser();
  onlineUsers.unshift(String(socket.guest));
  socket.emit('new-user', onlineUsers);
  socket.broadcast.emit('new-user', [String(socket.guest)]);

  socket.on('disconnect', () => {
    onlineUsers.splice(onlineUsers.indexOf(socket.guest), 1);
    socket.broadcast.emit('user-left', String(socket.guest))
  });

  socket.on('change-name', (name) => {
    const oldName = String(socket.guest);
    onlineUsers.splice(onlineUsers.indexOf(socket.guest), 1);
    socket.guest = name;
    onlineUsers.unshift(name);
    io.emit('change-onlineUsers', { name, oldName });
  })

});
