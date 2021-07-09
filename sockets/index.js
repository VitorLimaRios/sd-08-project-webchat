const { formatDate } = require('../services/formatDate');
const { getRandomNickname } = require('../services/randomNickname');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('getNickname', () => {
      const nickname = getRandomNickname();
      socket.emit('yourNickname', nickname);
      socket.broadcast.emit('newUser', nickname);
    });

    socket.on('message', ({ chatMessage, nickname }) => {
      // const currentDate = Date.now();
      // console.log(typeof currentDate);
      const date = formatDate(new Date(Date.now()));

      const messageFormatted = `${date} - ${nickname}: ${chatMessage}`;
      io.emit('message', messageFormatted);
    });
  });
};
