const moment = require('moment')
const { getAll, saveMessages } = require('../models/messages')
const { userJoin, getOnlineUsers, userLeave, getCurrentUser } = require('../utils/handleUsers')

const  timestamp = () =>  moment().format('DD-MM-YYYY hh:mm:ss');
module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', async ({ userId, chatMessage }) => {
      const currentUser = getCurrentUser(userId)
      console.log('currentUser: ', currentUser)
      io.emit('message', `${timestamp()} - ${currentUser?.nickname}: ${chatMessage}`);
      // await saveMessages(chatMessage, currentUser?.nickname, timestamp());
    });
  
    socket.on('joinRoom', (nickname) => {
      userJoin(socket.id, nickname );
      io.emit('onlineUsers', getOnlineUsers());
    });
  
    socket.on('changNickname', (nickname) => {
      const findUser = getCurrentUser(socket.id);
      userLeave(socket.id)
      userJoin(socket.id, nickname)
      io.emit('onlineUsers', getOnlineUsers());
    });
  
    socket.on('disconnect', () => {
      userLeave(socket.id);
      io.emit('onlineUsers', getOnlineUsers());
    });
  });
};
