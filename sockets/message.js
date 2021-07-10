const { dformat } = require('../helper');

const mensageria = async (message, io) => {
    const d = new Date();
    console.log(dformat(d), `- ${message.nickname}: ${message.chatMessage}`);
    const result = `${dformat(d)} - ${message.nickname}: ${message.chatMessage}`;
    await io.emit('message', result);
};

const nickList = [];
module.exports = (io) => io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('message', (message) => mensageria(message, io));
    socket.on('nickname add', async (nickname) => {
        nickList.push({ nickname, id: socket.id });
        await io.emit('nickname', nickList);
    });
    socket.on('nickname change', async (nickname) => {
        const index = nickList.findIndex((xablau) => xablau.id === socket.id);
        nickList[index].nickname = nickname;
        await io.emit('nickname', nickList);
        console.log('cahnge nickname', nickList, nickname, index);
    });
    socket.on('disconnect', async () => {
        const index = nickList.findIndex((xablau) => xablau.id === socket.id);
        nickList.splice(index);
        await io.emit('nickname', nickList);
        console.log('user disconnected', nickList, index, socket.id);
      });
  });