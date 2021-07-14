const moment = require('moment');
const MessageModel = require('../models/Message');

const usersArray = [];

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.emit('connection', usersArray);
    socket.on('users', (users) => io.emit('users', users));
    socket.on('disconnect', () => {
      socket.broadcast.emit('updateUsers');
      usersArray.pop();
    });

    socket.on('message', async ({ nickname, chatMessage }) => {
      const dateMsg = moment().format('DD-MM-yyyy HH:mm:ss');
      await MessageModel.create(chatMessage, nickname, dateMsg);
      io.emit('message', `${dateMsg} - ${nickname}: ${chatMessage}`);
    });

    socket.on('serverMessage', (nickname) => {
      socket.broadcast.emit('serverMessage', nickname);
      usersArray.push(nickname);
    });
  });
};
