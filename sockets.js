const moment = require('moment');
const model = require('./models/chatModel');

let onlineUsers = [];

const newUser = (nickname, socket) => {
  const user = { nickname, socket };
  onlineUsers.push(user);
  return user;
};

const currentUsers = (io) => {
  io.emit('currentUsers', onlineUsers.map(({ nickname }) => nickname));
};

const customNickname = (io, nickname, socket) => {
  onlineUsers.forEach((user) => {
    const currUser = user;
    if (user.socket === socket) {
      currUser.nickname = nickname;
    }
  });
  currentUsers(io);
};

const disconnectUser = (io, socket) => {
  onlineUsers = onlineUsers.filter((user) => user.socket !== socket);
  currentUsers(io);
};

module.exports = (io) => io.on('connection', async (socket) => {
  const { nickname: currentNickname } = socket.handshake.query;
  newUser(currentNickname, socket);

  currentUsers(io);
  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = moment().format('DD-MM-yyyy HH:mm:ss');
    await model.saveMessage({ message: chatMessage, nickname, timestamp: date });
    const message = `${date} - ${nickname}: ${chatMessage}`;
    io.emit('message', message);
  });

  const allMessages = await model.getAll();
  const chatHistory = (allMessages).map(({ message, nickname, timestamp }) => (
    `${timestamp} ${nickname} ${message}`
    ));

    socket.emit('chatHistory', chatHistory);
    socket.on('newNickname', ((nickname) => customNickname(io, nickname, socket)));
    socket.on('disconnect', () => disconnectUser(io, socket));
});
