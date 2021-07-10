const { dformat } = require('../helper');

const mensageria = (message, io) => {
    const d = new Date();
    console.log(dformat(d), `- ${message.nickname}: ${message.chatMessage}`);
    const result = `${dformat(d)} - ${message.nickname}: ${message.chatMessage}`;
    io.emit('message', result);
};

const nickList = [];
module.exports = (io) => io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('message', (message) => mensageria(message, io));
    socket.on('nickname add', (nickname) => {
        nickList.push({ nickname, id: socket.id });
        io.emit('nickname', nickList);
    });
    socket.on('nickname change', (nickname) => {
        const index = nickList.findIndex((xablau) => xablau.id === socket.id);
        nickList[index].nickname = nickname;
        io.emit('nickname', nickList);
        console.log('cahnge nickname', nickList, nickname, index);
    });
    socket.on('disconnect', () => {
        const index = nickList.findIndex((xablau) => xablau.id === socket.id);
        nickList.splice(index);
        io.emit('nickname', nickList);
        console.log('user disconnected', nickList, index, socket.id);
      });
  });