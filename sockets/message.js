const { dformat, findIndex } = require('../helper');

const nickList = [];

const mensageria = async (message, io) => {
    const d = new Date();
    console.log(dformat(d), `- ${message.nickname}: ${message.chatMessage}`);
    const result = `${dformat(d)} - ${message.nickname}: ${message.chatMessage}`;
    await io.emit('message', result);
};

module.exports = (io) => io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('message', (message) => mensageria(message, io));
    socket.on('nickname add', async (nickname) => {
        nickList.push({ nickname, id: socket.id });
        await io.emit('nickname', nickList);
    });
    socket.on('nickname change', async (nickname) => {
        const index = findIndex(nickList, socket.id);
        nickList[index].nickname = nickname;
        await io.emit('nickname', nickList);
    });
    socket.on('disconnect', async () => {
        const index = findIndex(nickList, socket.id);    
        // while (index < 0) { console.log('Aguarde', index); index = findIndex(nickList, socket.id); }
        nickList.splice(index, 1);
        await io.emit('nickname', nickList);
        console.log('disconnected', nickList, index, socket.id);
      });
  });