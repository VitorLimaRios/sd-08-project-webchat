const Service = require('../services').Messages;

module.exports = (io, socket) => {
  socket.on('message', async (data) => {
    const modelData = data;
    modelData.timestamp = new Date();
    await Service.insertOne(modelData);
    const { timestamp: ts, nickname, chatMessage } = modelData;
    const clientData = `${ts.toLocaleString('pt-br')} ${nickname} ${chatMessage}`;
    io.emit('message', clientData);
  });
};
