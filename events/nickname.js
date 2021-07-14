const { nanoid } = require('nanoid');

module.exports = (io, socket, socketList) => {
  const modelData = { id: socket.id, nickname: nanoid(16) };
  socketList.push(modelData);
  io.emit('updateOnlineClients', socketList);
  
  socket.on('disconnect', (_reason) => {
    const idx = socketList.findIndex(({ id }) => id === socket.id);
    socketList.splice(idx, 1);
    io.emit('updateOnlineClients', socketList);
  });
  
  socket.on('updateNickname', (newNickname) => {
    const idx = socketList.findIndex(({ id }) => id === socket.id);
    socketList.splice(idx, 1, newNickname);
    io.emit('updateOnlineClients', socketList);
  });
};