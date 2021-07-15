const Chat = require('../models/Chat');

function updateAll(socket, connectedUsers, userActual) {
  socket.broadcast.emit('list-update', {
    joined: userActual.userName,
    list: connectedUsers,
  });
}
module.exports = {
  joinRequest: (socket, user, connectedUsers, messagesList) => {
    const userActual = user;
    socket.on('join-request', (userName) => {
      userActual.userName = userName;
      connectedUsers.push(userName);
      updateAll(socket, connectedUsers, userActual);
      socket.emit('messages-update', {
        messages: messagesList,
      });
      socket.emit('user-ok', {
        joined: userActual.userName,
        list: connectedUsers,
      });
      console.log('Nova Conexão', connectedUsers);
    });
    return userActual;
  },
  disconnect: (socket, connectedUsers, userActual) => {
    let userList = connectedUsers;
    userList = connectedUsers.filter((user) => user !== userActual.userName);
    socket.on('disconnect', () => {
      console.log('desconectado', userActual.userName, userList);
      socket.broadcast.emit('user-desconected', {
        left: userActual.userName,
        list: userList,
      });
    });
  },
  message: (socket, messagesList, io) => {
    socket.on('message', async (message) => {
      const msgTime = new Date().toLocaleString().replaceAll('/', '-');
      let { nickname } = message;
      if (socket.userName !== undefined) {
        nickname = socket.userName;
      }
      const chatMessage = `${msgTime} - ${nickname}: ${message.chatMessage}`;
      await Chat.setMessage(chatMessage, nickname, msgTime);
      messagesList.push(chatMessage);
      io.emit('message', chatMessage);
      socket.broadcast.emit('messages-update', {
        messages: messagesList,
      });
    });
  },
  alterNickname: (socket, user, connectedUsers) => {
    const userActual = user;
    const userList = connectedUsers;
    socket.on('alter-nickname', (nickname) => {
      const indexUser = userList.findIndex(
        (userConected) => userConected === userActual.userName,
      );
      userList[indexUser] = nickname;
      userActual.userName = nickname;
      socket.emit('user-ok', userList);
      updateAll(socket, connectedUsers, userActual);
    });
    return { userActual, userList };
  },
};
