const Service = require('../services').Messages;

module.exports = (io, socket) => {
  socket.on('message', async (data) => {
    const modelData = data;
    modelData.timestamp = new Date();
    await Service.insertOne(modelData);
    const { timestamp: ts, nickname, message } = modelData;
    const dateTime = ts.toLocaleString('pt-br').replace(/\//g, '-');
    const clientData = `${dateTime} ${nickname} ${message}`;
    io.emit('message', clientData);
  });
};
