const disconnect = (socket) => {
  socket.on('disconnect', () => {
    socket.broadcast.emit('logout', `${socket.id} DescOnectado!`);
  });
};

const getDate = () => {
  const date = new Date()
    .toLocaleString({}, { hour12: true })
    .replace(/\//g, '-');
  return date;
};

const connect = (socket) => {
  socket.broadcast.emit('users', `${socket.id} COnectado!`);
};

const message = (io, socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const date = getDate();
    const messageChat = `${date} - ${nickname}: ${chatMessage}`;
    io.emit('message', messageChat);
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  socket.emit('server', 'Bem vindo');
  connect(socket);
  disconnect(socket);
  message(io, socket);
});