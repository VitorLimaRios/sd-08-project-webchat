const moment = require('moment');

module.exports = (io) => io.on('connection', (socket) => {
  console.log('Alguém se conectou');

  socket.on('message', ({ nickname, chatMessage }) => {
    const dateHour = moment().format('DD-MM-YYYY h:mm:ss A');
    io.emit('message', `${dateHour} - ${nickname}: ${chatMessage}`);
  });

  socket.on('disconnect', () => {
    console.log('Alguém saiu');
  });

  socket.emit('welcome', ('Seja bem-vindo(a) ao TrybeWebChat'));

  socket.broadcast.emit('newConnection', { message: 'Nova conexão' });
});