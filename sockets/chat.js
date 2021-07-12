const moment = require('moment');
// docs: https://momentjs.com/

let nick;

module.exports = (io) => io.on(
  'connection',
  (socket) => {
    const defaultNickname = socket.id.substring(0, 16);
    socket.emit('welcome', `Welcome ${socket.id}`);
    socket.emit('defaultNickname', defaultNickname);
    console.log(`User ${socket.id} connected`);
  socket.on('message', ({ chatMessage, nickname }) => {
    const date = moment().format('DD-MM-YYYY');
    const hour = moment().format('LTS');
    const serverMessage = `${date} ${hour} - ${nickname}: ${chatMessage}`;
    io.emit('message', serverMessage);
  });
  socket.on('changeNickname', (newName) => {
    nick = newName;
    io.emit('updateNickname', { newNick: nick, user: defaultNickname });
  });
  },
);
