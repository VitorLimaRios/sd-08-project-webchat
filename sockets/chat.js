const getDate = require('../public/utils/getDate');
const { onlineAdd, onlineRemove, getList } = require('../public/utils/online');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('online', (name) => {
      onlineAdd(name);
      socket.on('disconnect', () => {
        onlineRemove(name);
        io.emit('removeName', name);
      });
      socket.emit('list', getList());
      socket.broadcast.emit('updatelist', name);
    });
    socket.on('message', ({ chatMessage, nickname }) => {
      io.emit('message', `${getDate()} - ${nickname}: ${chatMessage}`);
    });
  });
};
