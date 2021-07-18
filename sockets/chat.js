const moment = require('moment');
const MessageModel = require('../models/Message');

// Feito com a ajuda do mestre Paulo Simões
let users = [];

const addUsers = (socket) => {
  const nickname = socket.id.slice(0, 16);
  const newUser = { socket, nickname };
  users.push(newUser);
  return newUser;
};

const getNicknames = () => users.map(({ nickname }) => nickname);

const sendNickname = (socket, nickname) => {
  socket.emit('sendNickname', nickname);
};

const changeNickname = (socket, nicknameUser) => {
  const userFind = users.find((user) => user.socket === socket);
  userFind.nickname = nicknameUser;
};

const updatedUsers = (io) => {
  io.emit('updatedUsers', getNicknames());
};

const userDisconnect = (socket) => {
  users = users.filter((user) => user.socket !== socket);
};

const messageFormat = (chatMessage, nickname, date) => `${date} ${nickname}: ${chatMessage}`;

const createMessage = async (chatMessage, nickname, date) => {
  const newMessage = {
    message: chatMessage,
    nickname,
    timestamp: date,
  };
  await MessageModel.create(newMessage);
};

const getAllMessages = async () => {
  const messages = await MessageModel.getAll();
  return messages.map(({ message, nickname, timestamp }) => 
  messageFormat(message, nickname, timestamp));
};

const allMessages = async (socket) => {
  socket.emit('allMessages', await getAllMessages());
};

module.exports = (io) => io.on('connection', async (socket) => {
  const newUser = addUsers(socket);
  sendNickname(socket, newUser.nickname);
  updatedUsers(io);
  await allMessages(socket);

  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = moment().format('DD-MM-yyyy HH:mm:ss A');
    await createMessage(chatMessage, nickname, date);
    io.emit('message', messageFormat(date, nickname, chatMessage));
  });

  socket.on('saveNickname', ({ nickname }) => {
    changeNickname(socket, nickname);
    sendNickname(socket, newUser.nickname);
    updatedUsers(io);
  });

  socket.on('disconnect', () => {
    userDisconnect(socket);
    updatedUsers(io);
  });
});