const moment = require('moment');
const model = require('../models/Chat');

const onlineUsers = [];

const generateUser = (socket) => {
  const { id } = socket;
  const [initialNick] = id.match(/[\w'-]{16}/g);
  onlineUsers.push({ id, nickname: initialNick });
  socket.emit('userConnected', initialNick);
};

const generateHistory = async (socket) => {
  const messageHistory = await model.getMessages();
  socket.emit('getHistory', messageHistory);
};

const sendMessage = (socket, io) => {
  const timestamp = moment().format('DD-MM-YYYY h:mm:ss A');
  socket.on('message', async ({ chatMessage, nickname }) => {
    io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
    await model.createMessage({ message: chatMessage, nickname, timestamp });
  });
};

const updateNickname = (socket, io) => {
  socket.on('updateNickname', (newNick) => {
    const index = onlineUsers.findIndex((user) => user.id === socket.id);
    onlineUsers[index].nickname = newNick;
    io.emit('updateUsers', onlineUsers);
  });
};

const updateUsers = (socket, io) => {
  socket.on('updateUsers', () => {
    io.emit('updateUsers', onlineUsers);
  });
};

const severConnection = (socket, io) => {
  socket.on('disconnect', () => {
    const index = onlineUsers.findIndex((user) => user.id === socket.id);
    onlineUsers.splice(index, 1);
    io.emit('updateUsers', onlineUsers);
  });
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    generateUser(socket);
    generateHistory(socket);
    sendMessage(socket, io);
    updateUsers(socket, io);
    updateNickname(socket, io);
    severConnection(socket, io);
  });
};
