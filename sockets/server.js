const messages = require('../src/utils/messagesFormater');
const { userJoin, userLeave } = require('../src/utils/handleUsers');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', async ({ nickName, userMessage }) => {
      io.emit('message', messages(nickName, userMessage));
    });
    socket.on('newUser', (user) => {
      const users = userJoin(socket.id, user);
      io.emit('newUser', users);
    });
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
      if (user) {
        io.emit('message', messages(user.nickname, 'has ben left'));
      }
    });
  });
};
