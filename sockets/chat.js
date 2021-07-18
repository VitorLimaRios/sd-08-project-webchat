/* https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/replace
https://stackoverflow.com/questions/16970237/jquery-replace-g-do-not-work-for-me-but-others
*/
// inspirações para a função getDate acima

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