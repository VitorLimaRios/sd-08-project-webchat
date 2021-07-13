const moment = require('moment');
const { saveMessages } = require('../models/messages');
const { userJoin, getOnlineUsers, userLeave } = require('../utils/handleUsers');

const timestamp = () => moment().format('DD-MM-YYYY hh:mm:ss');
module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', async ({ chatMessage, nickname  }) => {
      io.emit('message', `${timestamp()} - ${nickname}: ${chatMessage}`);
      saveMessages(chatMessage, nickname, timestamp());
    });
    socket.on('joinRoom', (nickname) => {
      userJoin(socket.id, nickname);
      io.emit('onlineUsers', getOnlineUsers());
    });
    socket.on('changNickname', (nickname) => {
      userLeave(socket.id);
      userJoin(socket.id, nickname);
      io.emit('onlineUsers', getOnlineUsers());
    });
    socket.on('disconnect', () => {
      userLeave(socket.id);
      io.emit('onlineUsers', getOnlineUsers());
    });
  });
};
