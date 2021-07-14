const formatDate = () => {
  const now = new Date();
  const search = '/';
  const replacer = new RegExp(search, 'g');
  const date = now.toLocaleDateString('pt-BR',
    { hour: 'numeric', minute: 'numeric', hour12: true });
  const result = date.replace(replacer, '-');
  return result;
};

const formatMessage = (message, nickName) => {
  let contentMessage = `${formatDate()} - ${nickName}: `;
  contentMessage += message;
  return contentMessage; 
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('aLoggedInUser', () => {
      console.log(`Usúario logou -> ${socket.id}`);
    });
    socket.on('message', (data) => {
      const { chatMessage, nickname } = data;
      const msg = formatMessage(chatMessage, nickname);
      console.log(msg);
      io.emit('message', msg);
    });
  });
};
