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
    console.log('O ususario temporario', tempUser);
    usersLoggeds.push(tempUser);

    const idLogged = socket.id;
    // idLogged.substring(0, 16);
    objstest = { [idLogged.substring(0, 16).toString()]: tempUser, ...objstest };

    console.log('obejto de usuarios', objstest);

    console.log('Usuarios logados', usersLoggeds);
    const tramela = await findHistoryChatByUser();
    socket.emit('allchats', tramela);
    io.emit('userConnecteds', usersLoggeds);
  });
}

function updateUserList(socket, io) {
  socket.on('userChangeNickName', async (nicknameObj) => {
      console.log(nicknameObj);
      const newOps = nicknameObj.newNickName;
      const idLogged = socket.id;
      // idLogged.substring(0, 16);
      console.log('Id na atualização', idLogged);
      const source = { [idLogged.substring(0, 16).toString()]: newOps };
      // objstest = { [idLogged.substring(0, 16).toString()]: newOps, ...objstest };

      const returnedTarget = Object.assign(objstest, source);
      console.log('Retornado', returnedTarget);
      console.log('objeto apos atualização', objstest);

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
      console.log('Desconectando');
    let ops = socket.id;
    ops = ops.substring(0, 16);

    const whois = objstest[ops];

    console.log('ID solicitantes', ops);
      console.log('####Who is', whois);

    const whoRemove = usersLoggeds.indexOf(whois);
    console.log('who remove ', whoRemove);
    usersLoggeds.splice(whoRemove, 1);

    console.log('obejto de usuarios no Disconnect', objstest);
    console.log('----------------', usersLoggeds);
    console.log(`desconectou ${ops} position ${whoRemove}`);
    io.emit('userConnecteds', usersLoggeds);
    // io.emit('testeMarreta', 123);
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
