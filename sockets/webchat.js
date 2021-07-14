const moment = require('moment');
const MessageModel = require('../models/Message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.emit('connection', socket.id);
    socket.on('users', (users) => io.emit('users', users));
    socket.on('nicknameOn', (nickname) => socket.broadcast.emit('nicknameOn', nickname));
    socket.on('disconnect', () => {
      socket.broadcast.emit('updateUsers');
    });

    socket.on('message', async ({ nickname, chatMessage }) => {
      const dateMsg = moment().format('DD-MM-yyyy HH:mm:ss');
      await MessageModel.create(chatMessage, nickname, dateMsg);
      io.emit('message', `${dateMsg} - ${nickname}: ${chatMessage}`);
    });
  });
};

// socket.broadcast.emit('serverMessage', { message: 'Nova conexão' });
