const db = {};

const onDisconnect = (socket) => {
  delete db[socket.id];
  socket.on('disconnect', () => {
    const messageChannel = `cliente: ${socket.id} foi desconectado`;
    console.log(messageChannel);
  socket.broadcast.emit(
    'logout', { db, messageChannel },
  );
  });
};

const onNotification = (socket) => {
  const messageChannel = `cliente: ${socket.id} foi desconectado`;
  socket.broadcast.emit('notification', {
    db,
    messageChannel,
  });
};

const onWelcome = async (socket) => {
  socket.emit('welcome', {
    db,
  });
};

module.exports = (io) =>
  io.on('connection', (socket) => {
    db[socket.id] = { nickname: null };
    console.log(`cliente: conectado com id: ${socket.id}`);

    onDisconnect(socket);
    onNotification(socket);
    onWelcome(socket);
  });
