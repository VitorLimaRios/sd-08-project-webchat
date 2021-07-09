const crypto = require('crypto');

const generateFormatedDate = () => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const onlineUsers = {};

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('userConnected', () => {
    const randomUser = crypto.randomBytes(8).toString('hex');
    console.log(`ID: ${socket.id} / Nickname: ${randomUser} conectou à sala`);
    io.emit('saveStorage', { socketId: socket.id, nickname: randomUser });
    onlineUsers[socket.id] = randomUser;
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('disconnect', () => {
    console.log(`ID: ${onlineUsers[socket.id]} desconectou-se`);
    delete onlineUsers[socket.id];
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const date = generateFormatedDate();
    const message = `${date} ${nickname} ${chatMessage}`;
    io.emit('message', message);
  });
});