const addZero = (date) => {
  if (date <= 9) return `0${date}`;
  return date;
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', ({ nickname, chatMessage }) => {
      const today = new Date(Date.now());
      const date = `${addZero(today.getDate().toString())}-${addZero((today.getMonth() + 1)
        .toString())}-${addZero(today.getFullYear().toString())}`;
      const time = `${today.getHours()}:${addZero(today
        .getMinutes())}:${addZero(today.getSeconds())}`;
      const timestamp = `${date} ${time}`;
      const postMessage = `${timestamp} - ${nickname}: ${chatMessage} \n`;
      io.emit('postMessage', postMessage);
    });

    socket.on('disconnect', () => {
      socket.broadcast.emit('serverMessage', `Xiii! ${socket.id} acabou de se desconectar! :( \n`);
    });
  });
};

// Reference: https://blog.betrybe.com/javascript/javascript-date-format/
