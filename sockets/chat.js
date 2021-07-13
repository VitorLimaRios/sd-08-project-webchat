const chatModel = require('../models/chatModel');

const getMessage = (data) => {
  const date = new Date();
  const dateFormat = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  const hourFormat = `${date.getHours()}:${date.getMinutes()}`;
  const ioReturn = `${dateFormat} ${hourFormat} - ${data.nickname}: ${data.chatMessage}`;
  const dbReturn = {
    message: data.chatMessage,
    nickname: data.nickname,
    timestamp: `${dateFormat} ${hourFormat}`,
  };
  return [dbReturn, ioReturn];
};

module.exports = (io) => io.on('connection', async (socket) => {
  const chat = await chatModel.getAll();
  socket.emit('history', chat);

  socket.on('message', async (data) => {
    const message = getMessage(data);
    await chatModel.newMessage(message[0]);
    io.emit('message', message[1]);
  });
});
