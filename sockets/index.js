const { formatDate } = require('../services/formatDate');
const { getRandomNickname } = require('../services/randomNickname');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected! ID: ${socket.id}`);
    socket.emit('getconnection');
    socket.on('getNickname', () => {
      const randomNickname = getRandomNickname();
      socket.emit('yourNickname', randomNickname);
    });

    socket.on('getUsers', () => {
      socket.broadcast.emit('sendNickname');
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
