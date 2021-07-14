const moment = require('moment');
// docs: https://momentjs.com/

// let nick;
const usersNicknames = {};

const createUser = (socket) => {
  const customId = socket.id.substring(0, 16);
  usersNicknames[socket.id] = customId;
  socket.emit('defaultNickname', customId);
};

const sendMessageToAll = (io, { chatMessage, nickname }) => {
  const timestamp = moment().format('DD-MM-YYYY h:mm:ss A\'');
  const serverMessage = `${timestamp} - ${nickname}: ${chatMessage}`;

  io.emit('message', serverMessage);
};

const changeNick = (socket, io, newNick) => {
  usersNicknames[socket.id] = newNick;
  io.emit('updateNickname', { userId: socket.id, newNick });
};

module.exports = (io) => {
 io.on('connection',
  (socket) => {
    // console.log(`User ${socket.id} connected`);
    createUser(socket);
    socket.emit('socketId', socket.id);
    io.emit('allNicknames', usersNicknames);    
    socket.on('changeNickname', (newNick) => { changeNick(socket, io, newNick); });
    socket.on('message', (message) => { sendMessageToAll(io, message); });
    socket.on('disconnect', (_reason) => {
      delete usersNicknames[socket.id];
      io.emit('removeUser', socket.id);
    });
  });
};
