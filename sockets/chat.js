const aux = require('../utils/aux');
const messagesController = require('../controllers/messagesController');

const messageFormater = (nickname, message) => {
  const newMessage = { nickname, message, timestamp: aux.timestampGenerator() };
  return newMessage;
};

let usersList = [];

const userIn = (io, socket) => {
  socket.on('userIn', (user) => {
    socket.broadcast.emit(
      'chatMessage',
      messageFormater('BOT', `${user.userNickname} entrou no chat!`),
    );
    socket.emit('chatMessage', messageFormater('BOT', 'Bem-vindo(a)!'));
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
    if (userDisconnected.userNickname !== undefined) {
      io.emit('chatMessage', messageFormater('BOT', `${userDisconnected.userNickname} saiu!`));
    }
    io.emit('usersList', usersList);
  });
};

const chatMessage = (io, socket) => {
  socket.on('userMessage', async ({ nickname, message }) => {
    const newChatMessage = messageFormater(nickname, message);
    try {
      await messagesController.saveMessage(newChatMessage);
      io.emit('chatMessage', newChatMessage);
    } catch (err) {
      console.log(err);
      socket.emit('BOT', messageFormater('Erro ao enviar messagem. Tente novamente.'));
    }
  });
};

const newNickname = (io, socket) => {
  socket.on('newNickname', (user) => {
    const searchUserOLD = usersList.filter((item) => item.id === socket.id);
    const userOLD = searchUserOLD[0];
    const usersListOLD = usersList.filter((item) => item.id !== socket.id);
    io.emit(
      'chatMessage',
      messageFormater('BOT', `${userOLD
        .userNickname} mudou de nickname para "${user.userNickname}"!`),
    );
    usersList = usersListOLD;
    usersList.push(user);
    io.emit('usersList', usersList);
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  userIn(io, socket);
  userOut(io, socket);
  chatMessage(io, socket);
  newNickname(io, socket);
});
