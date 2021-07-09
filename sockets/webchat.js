const formattedDate = () => {
  const dateTimeNow = new Date();

  return `${dateTimeNow.getDate()}-`
  + `${dateTimeNow.getMonth() + 1}-`
  + `${dateTimeNow.getFullYear()} `
  + `${dateTimeNow.getHours()}:`
  + `${dateTimeNow.getMinutes()}`;
};

module.exports = (io) => io.on('connection', (socket) => {
  console.log(`Usuário conectado com sucesso! SocketId: ${socket.id} `);

  socket.on('message', ({ chatMessage, nickname }) => {
    console.log(chatMessage);

    const message = `${formattedDate()} - ${nickname}: ${chatMessage}`;
    io.emit('message', message);
  });
});
