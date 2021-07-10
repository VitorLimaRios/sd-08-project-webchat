const clientModel = require('./models/clientModel');

let allClients = [];

const generateRandomNick = () => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const arrayCaracters = caracteres.split('');
  let randomNick = '';
  for (let index = 0; index < 16; index += 1) {
    randomNick += arrayCaracters[parseInt(Math.random() * 52, 10)];
  }
  return randomNick;
};

const updateAllClients = (newName, id) => {
  const clientsUpToDate = allClients.map((client) => {
    if (client.id === id) {
      return { nickname: newName, id };
    }
    return client;
  });
  allClients = [...clientsUpToDate];
};

module.exports = (io) =>
  io.on('connection', async (socket) => {
    const randomNickname = generateRandomNick();
    const allMessages = await clientModel.getAllUsersMessages();
    io.to(socket.id).emit('userNickname', { randomNickname, allClients, allMessages });
    socket.broadcast.emit('newUser', { randomNickname, id: socket.id });
    allClients = [...allClients, { nickname: randomNickname, id: socket.id }];

    socket.on('message', async ({ chatMessage, nickname }) => {
      let date = new Date().toLocaleString();
      date = date.replace('/', '-');
      date = date.replace('/', '-');
      await clientModel.insertUserMessage(chatMessage, nickname, date);
      io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
    });

    socket.on('changeNickname', ({ nickname: newNick }) => {
      io.to(socket.id).emit('changeUserNick', newNick);
      socket.broadcast.emit('changeUserNickList', { newNick, id: socket.id });
      updateAllClients(newNick, socket.id);
    });
  });
