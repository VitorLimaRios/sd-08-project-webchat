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

const users = [];
let guestId = 0;

module.exports = (io) => io.on('connection', (socket) => {
  console.log('Alguém se conectou');
  guestId += 1;
  const nick = nickAleatorio(16);
  const guest = `Guest ${guestId}`;
  users.push({ guestId, user: guest, nick });
  // socket.write('Bem vindo ao chat!\n');
  socket.on('message', ({ nickname, chatMessage }) => {
    const dateHour = moment().format('DD-MM-YYYY h:mm:ss A');
    io.emit('message', `${dateHour} - ${nickname}: ${chatMessage}`);
  });
  socket.on('saveNickName', ({ nickname }) => {
    io.emit('saveNickName', `${nickname}`);
  });
  socket.emit('newConnection', { message: `${users[guestId - 1].nick}` });
  socket.broadcast.emit('newConnection', { message: `${users[guestId - 1].nick}` });
  socket.on('disconnect', () => {
    console.log('Alguém saiu');
  });
});
