/* eslint-disable no-unused-expressions */
const messages = require('../utils/messagesFormater');
const { userJoin, userLeave, getOnlineUsers, getCurrentUser } = require('../utils/handleUsers');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('joinRoom', (user) => {
      userJoin(socket.id, user);
      socket.broadcast.emit('message', messages(user, 'has joined the chat'));
      io.emit('onlineUsers', getOnlineUsers());
    });
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
      user ? io.emit('message', messages(user, 'has left the chat')) : '';
        io.emit('onlineUsers', user);
    });
    socket.on('chatMessage', (message) => {
      const user = getCurrentUser(socket.id);
      io.emit('message', messages(user.nickname, message));
    });
  });
};
