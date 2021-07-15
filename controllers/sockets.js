const { controllerNewMessage } = require('./controllerAndDataHandler');

// module.exports = (io, usersOnline) => {
//   io.on('connection', (socket) => {
//     console.log(`${usersOnline} aqui`);
//     socket.emit('loadingMsgAndUsersLogged', usersOnline);
    // socket.on('message', (data) => {
    //   const { chatMessage, nickname } = data;
    //   const msg = controllerNewMessage(chatMessage, nickname);
    //   io.emit('message', msg);
    // });
//     socket.on('newLoggedInUser', (nickName) => {
//       usersOnline.push(nickName);
//       socket.broadcast.emit('newLoggedInUser', nickName);
//     });
//     socket.on('disconnect', () => {
//       console.log('Usuario desconectado');
//     });
//   });
// };

const usersOnline = {};

const message = (socket, io) => {
  socket.on('message', (data) => {
    const { chatMessage, nickname } = data;
    const msg = controllerNewMessage(chatMessage, nickname);
    io.emit('message', msg);
  });
};

const newLoggedInUser = (socket) => {
  socket.on('newLoggedInUser', (nickName) => {
    usersOnline[socket.id] = nickName;
    console.log(usersOnline);
    socket.emit('loadingMsgAndUsersLogged', Object.values(usersOnline));
    socket.broadcast.emit('newLoggedInUser', nickName);
  });
};

const removeNicknameOnDisconnect = (socket) => { delete usersOnline[socket.id]; };

const disconnectedUser = (socket) => {
  socket.broadcast.emit('removed-user', usersOnline[socket.id]);
};

const disconnect = (socket) => {
  socket.on('disconnect', () => {
      console.log(`Usuario desconectado ${usersOnline[socket.id]}`);
      disconnectedUser(socket);
      removeNicknameOnDisconnect(socket);
  });
};

const updateNickname = (newNickname, id) => {
  usersOnline[id] = newNickname;
};

const onEmitNickName = (socket) => {
  socket.on('update-nickname', ({ nickname, oldNickname }) => {
    updateNickname(nickname, socket.id);
    socket.broadcast.emit('update-nickname', {
      nickname: usersOnline[socket.id],
      oldNickname,
    });
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  newLoggedInUser(socket);
  message(socket, io);
  disconnect(socket);
  onEmitNickName(socket);
});