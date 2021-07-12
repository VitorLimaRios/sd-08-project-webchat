const moment = require('moment');

const allUser = [];

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('alguem conectou');
    socket.emit('hello', 'Seja Bem-Vindo ao NinjaWEBChat');
    // allUser.push(socket.id);
    // socket.emit('userList', `${allUser}`);

    // socket.on('userConect', (user) => {
    //   allUser.push(user);
    //   io.emit('userList', `${allUser}`);
    // });

    // socket.on('goin', () => {
    //   console.log(`${socket.id} entrouuuu!`);
    //   allUser.push(socket.id);

    //   io.emit('userList', `${allUser}`); // essa linha envia um aviso para o cliente que o ping chegou.
    // });

    socket.on('message', (message) => {
      const datePrint = moment().format('DD-MM-yyyy HH:mm:ss');

      io.emit('message', `${datePrint} ${message.chatMessage} ${message.nickname}`);
      // allUser.push(message.nickname);
      // io.emit('userList', `${allUser}`); // essa linha envia um aviso para o cliente que o ping chegou.
    });
  });
};