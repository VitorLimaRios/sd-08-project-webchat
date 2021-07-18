const moment = require('moment');
const MessageModel = require('./models/MessageModel');

let sockets = [];

const addUser = (nickname, socket) => {
  const newUser = {
    nickname,
    socket,
  };
  sockets.push(newUser);
  return newUser;
};

const online = (io) => {
  io.emit('onlineUser', sockets.map(({ nickname }) => nickname));
};

const changeNickname = (io, nickname, socket) => {
  sockets.forEach((user) => {
    const newSockets = user;
    if (user.socket === socket) newSockets.nickname = nickname;
  });
  online(io);
};

const disconnectUser = (io, socket) => {
  sockets = sockets.filter((user) => user.socket !== socket);
  online(io);
};

module.exports = (io) => io.on('connection', async (socket) => {
  const { nickname: userNickname } = socket.handshake.query;
  addUser(userNickname, socket);
  socket.on('message', async ({ chatMessage, nickname }) => {
    const currentDateTime = moment().format('DD-MM-yyyy HH:mm:ss');
    await MessageModel.createMessage(
      { message: chatMessage, nickname, timestamp: currentDateTime },
    );
    io.emit('message', `${currentDateTime} ${nickname} ${chatMessage}`);
  });
  const history = (await MessageModel.findAllMessages()).map(({ message, nickname, timestamp }) => (
    `${timestamp} ${nickname} ${message}`
  ));
  socket.emit('history', history);
  socket.on('replaceUserNickname', (newNickname) => changeNickname(io, newNickname, socket));
  socket.on('disconnect', () => disconnectUser(io, socket));
  online(io);
});
