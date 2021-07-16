const moment = require('moment');
const MessageModel = require('../models/Message');

const usersArray = [];

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.emit('connection', usersArray);
    socket.on('users', (users) => io.emit('users', users));
    socket.on('disconnect', () => {
      socket.broadcast.emit('updateUsers');
      usersArray.splice(usersArray.indexOfindexof({ nickname: nick.nickOld, id: sockect.id }));
      // const index = usersArray.findIndex((user) => user.id === socket.id);
      // usersArray.splice(index, 1);
      // delete usersObject[socket.id];
    });

    socket.on('message', async ({ nickname, chatMessage }) => {
      const dateMsg = moment().format('DD-MM-yyyy HH:mm:ss');
      await MessageModel.create(chatMessage, nickname, dateMsg);
      io.emit('message', `${dateMsg} - ${nickname}: ${chatMessage}`);
    });

    socket.on('serverMessage', (nickname) => {
      socket.broadcast.emit('serverMessage', nickname);
      usersArray.push({ nickname, id: socket.id });
    });

    socket.on('changeNickname', (nick) => {
      socket.broadcast.emit('changeNickname', nick);
      console.log('mudou nick: ', socket.id);
      usersArray.findIndex()
    });
  });
};

// mudar nickname no array
// delete