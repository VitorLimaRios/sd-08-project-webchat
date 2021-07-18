const moment = require('moment');

// Feito com a ajuda do mestre Paulo Simões
let users = [];

const addUsers = (socket) => {
  const nickname = socket.id.slice(0, 16);
  const newUser = { socket, nickname };
  users.push(newUser);
  return newUser;
};

const getNicknames = () => users.map(({ nickname }) => nickname);

const sendNickname = (socket, nickname) => {
  socket.emit('sendNickname', nickname);
};

const changeNickname = (socket, nicknameUser) => {
  const userFind = users.find((user) => user.socket === socket);
  userFind.nickname = nicknameUser;
};

const updatedUsers = (io) => {
  io.emit('updatedUsers', getNicknames());
};

const userDisconnect = (socket) => {
  users = users.filter((user) => user.socket !== socket);
};

module.exports = (io) => io.on('connection', (socket) => {
  const newUser = addUsers(socket);
  sendNickname(socket, newUser.nickname);
  updatedUsers(io);

  socket.on('message', ({ chatMessage, nickname }) => {
    const date = moment().format('DD-MM-yyyy HH:mm:ss A');
    io.emit('message', `${date} ${nickname}: ${chatMessage}`);
  });

  socket.on('saveNickname', ({ nickname }) => {
    changeNickname(socket, nickname);
    sendNickname(socket, newUser.nickname);
    updatedUsers(io);
  });

  socket.on('disconnect', () => {
    userDisconnect(socket);
    updatedUsers(io);
  });
});