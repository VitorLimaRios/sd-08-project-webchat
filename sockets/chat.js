const moment = require('moment');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('alguem conectou');
    socket.emit('hello', 'Seja Bem-Vindo ao NinjaWEBChat');

    socket.on('goin', () => {
      console.log(`${socket.id} entrouuuu!`);
      io.emit('reply', `${socket.id} enviou um ping!`); // essa linha envia um aviso para o cliente que o ping chegou.
    });

    socket.on('message', (message) => {
      const datePrint = moment().format('DD/MM/yyyy HH:mm:ss');

      io.emit('writeMessage', `${datePrint} ${message.chatMessage} ${message.nickname}`);
    });
  });
};