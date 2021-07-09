const moment = require('moment');

const currentDateTime = moment().format('DD-MM-yyyy HH:mm:ss');

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${currentDateTime} ${nickname} ${chatMessage}`);
  });
});
