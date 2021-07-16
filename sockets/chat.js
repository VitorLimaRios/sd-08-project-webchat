const moment = require('moment');
const { saveMessage, getMessage } = require('../controllers/messageControllers');

// Ideia do moment peguei no plantão!
const datePrint = moment().format('DD-MM-yyyy HH:mm:ss');

const allUser = {};
// Para trabalhar com objetos, estudei.:
// conteúdos do course;
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Working_with_Objects

const disconnect = (socket, io) => {
  delete allUser[socket.id];
  io.emit('updateUsers', Object.values(allUser));
};

module.exports = (io) => {
    io.on('connection', async (socket) => {
      const messageLoading = await getMessage();
      socket.emit('connection', socket.id, messageLoading);

      socket.on('newUser', (nickname) => {
        allUser[socket.id] = nickname;
        io.emit('updateUsers', Object.values(allUser));
      });

      socket.on('message', async (message) => {
        await saveMessage(message, datePrint);
        io.emit('message', `${datePrint} - ${message.nickname}: ${message.chatMessage}`);
      });

      socket.on('changeUser', (nickname) => {
        allUser[socket.id] = nickname;
        io.emit('updateUsers', Object.values(allUser)); 
       });

      socket.on('disconnect', () => disconnect(socket, io));
    });
  };
