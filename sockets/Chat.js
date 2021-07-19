const moment = require('moment');

const sendMessage = (socket, io) => {
  const timestamp = moment().format('DD-MM-YYYY h:mm:ss A');
  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
  });
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    sendMessage(socket, io);
  });
};
