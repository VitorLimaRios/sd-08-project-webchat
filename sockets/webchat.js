const formattedDate = () => {
  const dateTimeNow = new Date();

  return `${dateTimeNow.getDate()}-`
  + `${dateTimeNow.getMonth() + 1}-`
  + `${dateTimeNow.getFullYear()} `
  + `${dateTimeNow.getHours()}:`
  + `${dateTimeNow.getMinutes()}`;
};

const users = [];

const addNewMessage = (chatMessage, nickname, socket, io) => {
  const message = `${formattedDate()} - ${nickname || socket.id.slice(0, 16)}: ${chatMessage}`;
    io.emit('message', message);
};

const setOnlineUser = (socket, io) => {
  users.push(socket.id.slice(0, 16));
  io.emit('onlineUsers', users);
};

const changeNickName = (nickname, id, io) => {
  const index = users.indexOf(id);
  users[index] = nickname;
  io.emit('onlineUsers', users);
};

module.exports = (io) => io.on('connection', (socket) => {
  // console.log(`Usuário conectado com sucesso! SocketId: ${socket.id} `);

  socket.on('message', ({
    chatMessage,
    nickname,
  }) => addNewMessage(chatMessage, nickname, socket, io));

  socket.on('onlineUsers', () => setOnlineUser(socket, io));
  socket.on('changeNickName', ({ nickname, id }) => changeNickName(nickname, id, io));
});
