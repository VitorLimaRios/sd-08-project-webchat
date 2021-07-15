const { saveMessage } = require('../services/chatUseCase');
const { addUserOn, updateUserOn, removeUserOn } = require('../services/usersOnUseCase');

const db = {};

const getDateTime = () => {
  const getDate = new Intl.DateTimeFormat('pt-BR')
    .format(Date.now())
    .replace(/[/]/g, '-');

  const getTime = new Intl.DateTimeFormat('en', {
    timeStyle: 'short',
  }).format(Date.now());

  return `${getDate} ${getTime}`;
};

const onDisconnect = (socket) => {
  socket.on('disconnect', async () => {
    delete db[socket.id];
    const messageChannel = `cliente: ${socket.id} foi desconectado`;
    console.log(messageChannel);
    socket.broadcast.emit('logout', { db, messageChannel });
    await removeUserOn({ database: db});
  });
};

const onNotification = (socket) => {
  const messageChannel = `cliente: ${socket.id} foi conectado`;
  socket.broadcast.emit('notification', {
    db,
    messageChannel,
  });
};

const onWelcome = (socket) => {
  const messageChannel = `Seja Bem Vindo!! Cliente ${socket.id}`;
  socket.emit('welcome', {
    db,
    messageChannel,
  });
};

const onMessage = (io, socket) => {
  socket.on('message', async ({ nickname, chatMessage }) => {
    db[socket.id] = { nickname };
    const date = getDateTime();
    const messageChannel = `${date} - ${nickname}: ${chatMessage}`;
    io.emit('message', messageChannel);
    await saveMessage({ nickname, chatMessage, date });

  });
};

const onUsers = (io, socket) => {
  socket.on('users', async ({ nickname }) => {
    db[socket.id] = { nickname };
    io.emit('users', { db });
    await updateUserOn({ connectId: socket.id, nickname });
  });
};

module.exports = (io) =>
  io.on('connection', async (socket) => {
    const nickname = socket.id.substr(0, 16);
    await addUserOn({ connectId: socket.id, nickname});

    db[socket.id] = { nickname: socket.id.substr(0, 16) };
    console.log(`cliente: conectado com id: ${socket.id}`);
    onDisconnect(socket);
    onNotification(socket);
    onWelcome(socket);
    onMessage(io, socket);
    onUsers(io, socket);
  });
