function updateAll(socket, connectedUsers) {
  socket.broadcast.emit('list-update', {
    list: connectedUsers,
  });
}
module.exports = {
  joinRequest: (socket, user, connectedUsers, messagesList) => {
    const userActual = user;
    socket.on('join-request', (userName) => {
      userActual.userName = userName;
      connectedUsers.push(userName);
      updateAll(socket, connectedUsers);
      socket.emit('messages-update', {
        messages: messagesList,
      });
      socket.emit('user-ok', connectedUsers);
    });
    return userActual;
  },
  disconnect: (socket, connectedUsers, userActual) => {
    let userList = connectedUsers;
    socket.on('disconnect', () => {
      userList = connectedUsers.filter((user) => user !== userActual.userName);
      socket.broadcast.emit('list-update', {
        left: userActual.userName,
        list: userList,
      });
    });
  },
  message: (socket, messagesList) => {
    socket.on('message', (message) => {
      const msgTime = new Date().toLocaleString().replaceAll('/', '-');
      let { nickname } = message;
      if (socket.userName !== undefined) {
        nickname = socket.userName;
      }
      const chatMessage = `${msgTime} - ${nickname}: ${message.chatMessage}`;
      messagesList.push(chatMessage);
      socket.emit('message', chatMessage);
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
      updateAll(socket, connectedUsers);
    });
    return { userActual, userList };
  },
};
