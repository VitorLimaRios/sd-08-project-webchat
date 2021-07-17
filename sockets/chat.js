const getDate = require('../public/utils/getDate');

let onlineList = [];

const onlineAdd = (socket) => {
  const newUser = { nickname: socket.id.slice(0, 16), socket };
  onlineList.push(newUser);
  socket.emit('nickname', { nickname: newUser.nickname });
};

const updateOnlineList = (io) => {
  const users = onlineList.map(({ nickname }) => nickname);
  io.emit('renderUsers', users);
};

const changeNickname = (nickname, socket, io) => {
  const user = onlineList.find((currentUser) => currentUser.socket === socket);
  user.nickname = nickname;
  updateOnlineList(io);
};

const main = (io, socket) => {
  onlineAdd(socket);
  updateOnlineList(io);
};

const disconnect = (io, socket) => {
  onlineList = onlineList.filter((current) => current.socket !== socket);
  updateOnlineList(io);
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    main(io, socket);
    
    socket.on('disconnect', () => disconnect(io, socket));
    socket.on('message', ({ chatMessage, nickname }) => {
      io.emit('message', `${getDate()} - ${nickname}: ${chatMessage}`);
    });
    socket.on('changeNickname', (nickname) => changeNickname(nickname, socket, io));
  });
};
