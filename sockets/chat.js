const moment = require('moment');

let allUser = [];

// https://qastack.com.br/programming/1349404/generate-random-string-characters-in-javascript
const randomName = (socket) => {
  const userName = { id: socket.id, nickname: socket.id.slice(0, 16) };
  allUser.push(userName);
  console.log('allUser', allUser);
  return userName.nickname;
};

const getNickname = (users) => 
  users.map((user) => user.nickname);

  const updateNickname = (changeNickname) => {
    console.log('changeNickname', changeNickname);
  const getUser = allUser.filter((dataUser) => dataUser.id === changeNickname.id);
  console.log('getUser', getUser);
  const otherUser = allUser.filter((dataUser) => dataUser.id !== changeNickname.id);
  console.log('allUser before', allUser);
  allUser = [{ id: getUser[0].id, nickname: changeNickname.nickname }, ...otherUser];
  console.log('allUser after', allUser);
  return allUser;
  };

  const getUserNicknameSend = (id) => {
    // if (!id) {
    // return null;
    // }
    console.log('getUserNicknameSend id', id, allUser);
    const nicknameSend = allUser.filter((dataUser) => dataUser.id === id);
    console.log('getUserNicknameSend', nicknameSend[0].nickname);
    return nicknameSend[0].nickname;
  };

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('alguem conectou');
    randomName(socket);
    // socket.emit('hello', `${getRandomName},\n Seja Bem-Vindo ao NinjaWEBChat`);
    // socket.id = getRandomName;
    socket.emit('userList', allUser);
    socket.broadcast.emit('userList', allUser);

    socket.on('changeUser', (nickname) => {
      console.log('changeUser', nickname); // parei aqui!
      const updateNick = updateNickname(nickname);
      console.log('testUpdateNick', updateNick);
      
      // io.emit('userList', allUser); // essa linha envia um aviso para o cliente que o ping chegou.
    });

    socket.on('message', async (message) => {
      const datePrint = moment().format('DD-MM-yyyy HH:mm:ss');
      if (message.nickname) {
        io.emit('message', `${datePrint} ${message.chatMessage} ${message.nickname}`);
      } else {
        const nickname = await getUserNicknameSend(message.id);
        io.emit('message', `${datePrint} ${message.chatMessage} ${nickname}`);
      }
    });

    socket.on('disconnect', () => {
      const allNickaname = getNickname(allUser);
      io.emit('disconnectUser', socket.id, allNickaname);
    });
  });
};