module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Alguém se conectou');
  
    socket.on('disconnect', () => {
      console.log('Connection closed');
    });
  
    socket.on('message', (msg) => {
      io.emit('serverMessage', { message: msg });
    });
  
    socket.emit('message', ('Bem vinde'));
  
    socket.broadcast.emit('serverMessage', { message: 'Nova conexão' });
  });  
};
