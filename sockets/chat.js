const addZero = (date) => {
  if (date <= 9) return `0${date}`;
  return date;
};

const nowDate = () => {
  const today = new Date(Date.now());
    const date = `${addZero(today.getDate().toString())}-${addZero((today.getMonth() + 1)
      .toString())}-${addZero(today.getFullYear().toString())}`;
    const time = `${today.getHours()}:${addZero(today
      .getMinutes())}:${addZero(today.getSeconds())}`;
    return `${date} ${time}`;
};

const users = [];

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', ({ nickname, chatMessage }) => {
      const timestamp = nowDate();
      const postMessage = `${timestamp} - ${nickname}: ${chatMessage} \n`;
      io.emit('message', postMessage);
    });

    socket.emit('connection', socket.id);

    socket.on('userConnect', (userName) => {
      socket.broadcast.emit('userConnect', userName);
    });

    // socket.on('disconnect', () => {
    //   socket.broadcast.emit('serverMessage', `Xiii! ${socket.id} acabou de se desconectar! :( \n`);
    // });
  });
};

// Reference: https://blog.betrybe.com/javascript/javascript-date-format/
