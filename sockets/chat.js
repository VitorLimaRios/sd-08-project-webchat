const { getChatHour } = require('../utils/service');
const connection = require('../models/connection');

// const usersConnecteds = [];
const usersLoggeds = [];
let objstest = {};

// const usersConnecteds = [];

async function findHistoryChatByUser() {
  const allChat = connection().then((db) => db.collection('messages').find({ }).toArray());
  const allChatFinded = await allChat;
  return allChatFinded;
}

function createChat(chatHour, nickname, chatMessage) {
  connection().then((db) => db.collection('messages')
  .insertOne({ message: chatMessage, timestamp: chatHour, nickname }));
}

function userList(socket, io) {
  socket.on('toLeftPanel', async (tempUser) => {
    usersLoggeds.push(tempUser);
    console.log('Usuarios logados', usersLoggeds);
    const tramela = await findHistoryChatByUser();
    socket.emit('allchats', tramela);
    io.emit('userConnecteds', usersLoggeds);
  });
}

function updateUserList(socket, io) {
  socket.on('userChangeNickName', async (nicknameObj) => {
      console.log(nicknameObj);
      const socketId = socket.id;
      objstest = { [socketId]: nicknameObj.newNickName, ...objstest };

      console.log(objstest);

      const actualNicknamePosition = usersLoggeds.indexOf(nicknameObj.actualNickName);
      console.log('position to update', actualNicknamePosition);
      usersLoggeds.splice(actualNicknamePosition, 1);
      usersLoggeds.push(nicknameObj.newNickName);
      console.log('Apos update', usersLoggeds);
      io.emit('userConnecteds', usersLoggeds);
      const tramela = await findHistoryChatByUser();
      // console.log('os banco', tramela);
      socket.emit('allchats', tramela);
    });
}

function updateListOfLoggedUsersWhenDisconnect(socket, io) {
  socket.on('disconnect', () => {
    console.log('soliditante', socket.id);
    const opsid = socket.id;
    console.log('O array', usersLoggeds);
    console.log('testao doido', objstest[opsid]);
    // const praremover = objstest[opsid];
    let ops = socket.id;
    ops = ops.substring(0, 16);
    const whoRemove = usersLoggeds.indexOf(ops);
    usersLoggeds.splice(whoRemove, 1);
    console.log(`desconectou ${ops} position ${whoRemove}`);
    io.emit('userConnecteds', usersLoggeds);
  });
}

function generateMessage(socket, io, socketId) {
  socket.on('message', async (data) => {
    const { chatMessage, nickname } = data;
    const initialNickName = nickname || socketId.substring(0, 16);
    // console.log('Sockets', data);
    const chatHour = getChatHour();
    console.log('On chat ----', chatHour, nickname, chatMessage);
    await createChat(chatHour, nickname, chatMessage);

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
