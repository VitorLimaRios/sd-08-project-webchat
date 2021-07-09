module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`${socket.id} se conectou`);

    socket.on('message', ({ nickname, chatMessage }) => {
      const date = new Date();
      const day = date.getDate();
      const month = (date.getMonth() + 1);
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      
      const incZero = (n) => (n < 10 ? `0${n}` : n); 

      const dateNow = `${incZero(day)}-${incZero(month)}-${year}`;
      const timeNow = `${hours}:${incZero(minutes)}:${incZero(seconds)}`;

      const finalMessage = `${dateNow} ${timeNow} ${nickname}: ${chatMessage}`;

      console.log(finalMessage);

      io.emit('message', finalMessage);
    });
  });
};