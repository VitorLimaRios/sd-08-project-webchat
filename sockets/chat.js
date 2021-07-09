const crypto = require('crypto');

// Referência: https://www.horadecodar.com.br/2020/05/13/como-formatar-data-no-javascript-date-moment-js/
const generateFormatedDate = () => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  if (hours < 12) return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} AM`;
  if (hours > 12) {
    return `${day}-${month}-${year} ${(hours - 12)
        .toString().padStart(2, '0')}:${minutes}:${seconds} PM`;
  }
};

const onlineUsers = {};

const connectAndDisconectEvents = (io, socket) => {
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
};

module.exports = (io) => io.on('connection', (socket) => {
  connectAndDisconectEvents(io, socket);

  socket.on('message', ({ chatMessage, _nickname }) => {
    const date = generateFormatedDate();
    const userNickname = onlineUsers[socket.id];
    const message = `${date} - ${userNickname}: ${chatMessage}`;
    console.log(`${date} - ${userNickname}: ${chatMessage}`);
    io.emit('message', message);
  });

  socket.on('changeNickname', (newNickname) => {
    onlineUsers[socket.id] = newNickname;
    io.emit('onlineUsers', onlineUsers);
  });
});