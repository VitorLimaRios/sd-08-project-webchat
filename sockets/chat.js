const moment = require('moment');
const Model = require('../models/chatModel');

let users = [];

function randomNameGenerator(length, socket) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  users.push({ nickname: result, socketId: socket.id });
  return socket.emit('nickname', result);
} // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

async function formatMessage({ chatMessage, nickname }, io) {
    const newMessage = { nickname, message: chatMessage, timestamp: Date.now() };
    io.emit('message', `${moment(newMessage.timestamp)
      .format('DD-MM-YYYY HH:mm:ss')} - ${newMessage.nickname}: ${newMessage.message}`);
    const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');
    await Model.postChatMessage({ message: chatMessage, nickname, timestamp });
  }

const updateUserName = (data, socket, io) => {
  users = users.map((element) => {
    if (element.socketId === socket.id) {
      return { nickname: data, socketId: socket.id };
    }
    return element;
  });
  io.emit('usersOnline', users);
};

const dc = (socket, io) => {
  users = users.filter((element) => element.socketId !== socket.id);
  io.emit('usersOnline', users);
};

module.exports = (io) => io.on('connection', async (socket) => {
  randomNameGenerator(16, socket);
  io.emit('usersOnline', users);
  socket.on('message', (data) => formatMessage(data, io));
  socket.on('updateUserName', (data) => updateUserName(data, socket, io));
  socket.on('disconnect', () => dc(socket, io));
});
