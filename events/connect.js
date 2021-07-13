const { nanoid } = require('nanoid');

module.exports = (io, socket, socketList) => {
  const modelData = { id: socket.id, nickname: nanoid(16) };
  socketList.push(modelData);
  io.emit('update_on_clients', socketList);
  
  socket.on('disconnect', (_reason) => {
    const idx = socketList.findIndex(({ id }) => id === socket.id);
    socketList.splice(idx, 1);
    io.emit('update_on_clients', socketList);
  });
  
  socket.on('update_nickname', (data) => {
    socketList.forEach(({ id }, idx) => {
      if (id === socket.id) socketList.splice(idx, 1, data);
    });
    io.emit('update_on_clients', socketList);
  });
};