const moment = require('moment');
const model = require('./models/chatModel');

const onlineUsers = [];

const newUser = (nickname, socket) => {
  const user = { nickname, socket };
  onlineUsers.push(user);
  return user;
};

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = moment().format('DD-MM-yyyy HH:mm:ss');
    await model.saveMessage({ chatMessage, nickname, date });
    const message = `${date} - ${nickname}: ${chatMessage}`;
    io.emit('message', message);
    console.log(message);
  });
  // socket.on('newUser', (user) => {
  //   onlineUsers.push({ user, id: socket.id });
  //   io.emit('newUser', onlineUsers);
  // });
  // socket.on('newNickname', (nickname) => {

  // })
});
