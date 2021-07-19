const moment = require('moment');

const generateUser = (socket) => {
  const { id } = socket;
  const [initialNick] = id.match(/[\w'-]{16}/g);
  socket.emit('userConnected', initialNick);
};

const sendMessage = (socket, io) => {
  const timestamp = moment().format('DD-MM-YYYY h:mm:ss A');
  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
  });
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    generateUser(socket);
    sendMessage(socket, io);
  });
};
