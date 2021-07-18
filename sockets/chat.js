const getDate = () => {
  const date = new Date()
  .toLocaleString({}, { hour12: true })
  .replace(/\//g, '-');
  return date;
};

const message = (io, socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const date = getDate();
    const messageChat = `${date} - ${nickname}: ${chatMessage}`;
    io.emit('message', messageChat);
  });
};

const connect = (socket) => {
  socket.broadcast.emit('users', `${socket.id} COnectado!`);
};

const disconnect = (socket) => {
  socket.on('disconnect', () => {
    socket.broadcast.emit('logout', `${socket.id} DescOnectado!`);
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  socket.emit('message', 'Bem vindo');
  message(io, socket);
  connect(socket);
  disconnect(socket);
});