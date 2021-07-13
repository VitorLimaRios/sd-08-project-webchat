const chatModel = require('../models/chatModel');

const users = [];

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('message', async (message) => {
    const date = new Date().toLocaleString('pt-br').replace(/\//g, '-');
    await chatModel.addMessage(message);
    io.emit('message', `${date} ${message.nickname}: ${message.chatMessage}`);
  });

  socket.on('user', ({ newNick, oldNick }) => {
    if (oldNick) {
      const index = users.map((user) => user.newNick).indexOf(oldNick);
      users[index].newNick = newNick;
      return io.emit('user', users);
    }
      users.push({ newNick, id: socket.id });
      io.emit('user', users);
  });

  socket.on('disconnect', () => {
    users.splice(users.map((user) => user.id).indexOf(socket.id), 1);
    io.emit('user', users);
  });
});
