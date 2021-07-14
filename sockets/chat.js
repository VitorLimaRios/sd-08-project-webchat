const aux = require('../utils/aux');
const messagesController = require('../controllers/messagesController');

const messageFormater = async (nickname, message) => {
  const timeMessage = aux.timestampGenerator();
  if (nickname !== 'BOT') {
    await messagesController.saveMessage({ message, nickname, timestamp: timeMessage });
  }
  const newMessage = `${timeMessage} - ${nickname}: ${message}`;
  return newMessage;
};

let usersList = [];

const userIn = (io, socket) => {
  socket.on('userIn', async (user) => {
    const botMessage = await messageFormater('BOT', `${user.userNickname} entrou no chat!`);
    if (botMessage) {
      socket.broadcast.emit('message', botMessage);
    }
    // socket.emit('chatMessage', messageFormater('BOT', 'Bem-vindo(a)!'));
    Object.assign(user, { id: socket.id });
    usersList.push(user);
    io.emit('usersList', usersList);
  });
};

const userOut = (io, socket) => {
  socket.on('disconnect', () => {
    const searchUserDisconnected = usersList.filter((user) => user.id === socket.id);
    const userDisconnected = searchUserDisconnected[0];
    usersList = usersList.filter((user) => user.id !== socket.id);
    if (userDisconnected) {
      io.emit('message', messageFormater('BOT', `${userDisconnected.userNickname} saiu!`));
    }
    io.emit('usersList', usersList);
  });
};

const Message = (io, socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    try {
      const newChatMessage = await messageFormater(nickname, chatMessage);
      io.emit('message', newChatMessage);
    } catch (err) {
      console.log(err);
      socket.emit('BOT', messageFormater('Erro ao enviar messagem. Tente novamente.'));
    }
  });
};

const newNickname = (io, socket) => {
  socket.on('newNickname', async (user) => {
    const searchUserOLD = usersList.filter((item) => item.id === socket.id);
    const userOLD = searchUserOLD[0];
    const usersListOLD = usersList.filter((item) => item.id !== socket.id);
    const botMessage = await messageFormater('BOT', `${userOLD
      .userNickname} mudou de nickname para "${user.userNickname}"!`);
    if (botMessage) {
      io.emit('message', botMessage);
    }
    usersList = usersListOLD;
    usersList.push(user);
    io.emit('usersList', usersList);
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  userIn(io, socket);
  userOut(io, socket);
  Message(io, socket);
  newNickname(io, socket);
});
