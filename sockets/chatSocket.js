const crypto = require('crypto');

const chatModel = require('../models/chatModel');

let users = [];

const createMessage = (io, socket) => {
  socket.on('message', async (obj) => {
    const { chatMessage, nickname } = obj;

    const now = new Date();
    const date = `${now.getDay()}-${now.getMonth()}-${now.getFullYear()}`;
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    const message = `${date} ${time} - ${nickname}: ${chatMessage}`;

    await chatModel.create(message);
    io.emit('message', message);
  });
};

const addUser = async (io, socket) => {
  const randomName = crypto.randomBytes(8).toString('hex');
  socket.emit('generateName', randomName);
  users.push({ nickname: randomName, socketId: socket.id });
  io.emit('userList', users);
  const messageHistory = await chatModel.getAll();
  socket.emit('restoreMessages', messageHistory);
};

const updateUsers = (io, socket) => {
  socket.on('updateUsersList', async ({ nickname, newNickname }) => {
    users = users.map((obj) => {
      if (obj.nickname === nickname) return { ...obj, nickname: newNickname };
      return obj;
    });
    io.emit('userList', users);
  });
};

const socketDisconnect = (io, socket) => {
  socket.on('disconnect', () => {
    users = users.filter((obj) => obj.socketId !== socket.id);
    io.emit('userList', users);
    console.log(`${socket.id} se desconectou`);
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  console.log(`${socket.id} se conectou`);

  addUser(io, socket);
  updateUsers(io, socket);
  createMessage(io, socket);
  socketDisconnect(io, socket);
});
