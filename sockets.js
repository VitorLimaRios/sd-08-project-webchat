const moment = require('moment');

function nickAleatorio(tamanho) {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  let aleatorio = '';
  for (let i = 0; i < tamanho; i += 1) {
      const rnum = Math.floor(Math.random() * letras.length);
      aleatorio += letras.substring(rnum, rnum + 1);
  }
  return aleatorio;
}

module.exports = (io) => io.on('connection', (socket) => {
  console.log('Alguém se conectou');
  const sockets = [];
  let guestId = 0;
  guestId += 1;
  const nick = nickAleatorio(16);

  const guest = `Guest ${guestId}`;
  sockets.push({ guestId, user: guest, nick });
  socket.write('Bem vindo ao chat!\n');

  socket.emit('newConnection', { message: sockets[guestId - 1].nick });

  socket.on('message', ({ nickname, chatMessage }) => {
    const dateHour = moment().format('DD-MM-YYYY h:mm:ss A');
    io.emit('message', `${dateHour} - ${nickname}: ${chatMessage}`);
  });

  socket.on('disconnect', () => {
    console.log('Alguém saiu');
  });

  socket.broadcast.emit('newConnection', { message: sockets[guestId - 1].nick });
});