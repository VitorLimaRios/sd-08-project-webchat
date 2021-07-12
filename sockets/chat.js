const onlineUsers = [];

const randomUser = () => {
  let result = '';
  const characters = '0123456789';
  const cLength = characters.length;
  for (let i = 0; i < 12; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * cLength));
  }
  return `User${result}`;
};

module.exports = (io) => io.on('connection', (socket) => {
  let socketGuest = socket.guest;
  socketGuest = randomUser();
  onlineUsers.unshift(String(socketGuest));
  socket.emit('new-user', onlineUsers);
  socket.broadcast.emit('new-user', [String(socketGuest)]);

  socket.on('disconnect', () => {
    onlineUsers.splice(onlineUsers.indexOf(socket.guest), 1);
    socket.broadcast.emit('user-left', String(socket.guest));
  });

  socket.on('change-name', (name) => {
    socketGuest = socket.guest;
    const oldName = String(socketGuest);
    onlineUsers.splice(onlineUsers.indexOf(socketGuest), 1);
    socketGuest = name;
    onlineUsers.unshift(name);
    io.emit('change-onlineUsers', { name, oldName });
  });
});
