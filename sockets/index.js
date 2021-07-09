const { formatDate } = require('../services/formatDate');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', ({ chatMessage, nickname }) => {
      // const currentDate = Date.now();
      // console.log(typeof currentDate);
      const date = formatDate(new Date(Date.now()));

      const messageFormatted = `${date} - ${nickname}: ${chatMessage}`;
      io.emit('message', messageFormatted);
    });
  });
};
