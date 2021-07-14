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
      console.log(chatMessage);
      await MessageModel.create(chatMessage, nickname, dateMsg);
      console.log(chatMessage);
      io.emit('message', `${dateMsg} - ${nickname}: ${chatMessage}`);
    });

    // socket.on('updateUsers', (users) => socket.broadcast.emit('updateUsers', users));

    // TODO updateUsers e historico no arquivo sockets. gerar nickname.

    socket.on('historyMsgs', async () => {
      const getAllMessages = await MessageModel.getAll();
      getAllMessages.forEach((chatMessage) => socket
        .emit('message', `${chatMessage.timestamp} - ${chatMessage.nickname}: ${chatMessage.chatMessage}`));
    });
  });
};

// socket.broadcast.emit('serverMessage', { message: 'Nova conexão' });
