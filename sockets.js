const moment = require('moment');

const currentDateTime = moment().format('DD-MM-yyyy HH:mm:ss');
// let sockets = [];

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${currentDateTime} ${nickname} ${chatMessage}`);
  });

  socket.on('onlineUser', (nickname) => {  
    // sockets = sockets.push(nickname);
    io.emit('onlineUser', `${nickname}`);
  });
});
