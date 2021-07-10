const { getChatHour } = require('../utils/service');

// const usersConnecteds = [];
const usersLoggeds = [];

// const usersConnecteds = [];

function userList(socket, io) {
  socket.on('toLeftPanel', (tempUser) => {
    usersLoggeds.push(tempUser);
    console.log('Usuarios logados', usersLoggeds);
    io.emit('userConnecteds', usersLoggeds);
  });
}

function updateUserList(socket, io) {
  socket.on('userChangeNickName', (nicknameObj) => {
      console.log(nicknameObj);
      const actualNicknamePosition = usersLoggeds.indexOf(nicknameObj.actualNickName);
      console.log('position to update', actualNicknamePosition);
      usersLoggeds.splice(actualNicknamePosition, 1);
      usersLoggeds.push(nicknameObj.newNickName);
      console.log('Apos upadte', usersLoggeds);
      io.emit('userConnecteds', usersLoggeds);
    });
}

function updateListOfLoggedUsersWhenDisconnect(socket, io) {
  socket.on('disconnect', () => {
    let ops = socket.id;
    ops = ops.substring(0, 16);
    const whoRemove = usersLoggeds.indexOf(ops);
    usersLoggeds.splice(whoRemove, 1);
    console.log(`desconectou ${ops} position ${whoRemove}`);
    io.emit('userConnecteds', usersLoggeds);
  });
}

function generateMessage(socket, io, socketId) {
  socket.on('message', (data) => {
    const { chatMessage, nickname } = data;
    const initialNickName = nickname || socketId.substring(0, 16);
    // console.log('Sockets', data);
    const chatHour = getChatHour();

    const chatMessageComplete = `${chatHour} ${initialNickName} ${chatMessage}`;
    io.emit('message', chatMessageComplete);
  });
}

module.exports = (io) => io.on('connection', async (socket) => {
  console.log(`Usuario com ID ${socket.id}.`);
  const socketId = socket.id;
  // const users = await io.of('/').adapter.sids;
  // users.forEach((element) => {
  //   const iterator = element.values();
  //   const useres = iterator.next().value;
  // });
  // usersConnecteds.push(socketId.substring(0, 16));

  io.emit('userConnecteds', usersLoggeds);

  socket.emit('newUser', socketId.substring(0, 16));

  userList(socket, io);

  generateMessage(socket, io, socketId);
  updateListOfLoggedUsersWhenDisconnect(socket, io);

  updateUserList(socket, io);
});
