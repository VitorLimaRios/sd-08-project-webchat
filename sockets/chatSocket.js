const ChatModel = require('../models/chatModel');

const onlineUsers = [];

const createTimestamp = () => {
  const rawDate = new Date();
  const [date, time] = rawDate.toLocaleString().split(', ');
  const [day, month, year] = date.split('/');
  const formatedDay = day.length === 1 ? 0 + day : day;
  const formatedMonth = month.length === 1 ? 0 + month : month;
  return `${formatedDay}-${formatedMonth}-${year} ${time}`;
};

const formatMessage = async ({ chatMessage, nickname }) => {
  const timestamp = createTimestamp();
  await ChatModel.addNewMessage({ message: chatMessage, nickname, timestamp });
  return `${timestamp} - ${nickname}: ${chatMessage}`;
};

const setAllSavedMessages = async (socket) => {
  const allMessages = await ChatModel.getAllMessages();
  const allFormatedMessages = allMessages.map(
    ({ timestamp, nickname, message }) => `${timestamp} - ${nickname}: ${message}`,
  );
  socket.emit('setAllSavedMessages', allFormatedMessages);
};

const setAllOnlineUsers = (io) => {
  const allUsersNickname = onlineUsers.map((user) => user.nickname);
  io.emit('setAllOnlineUsers', allUsersNickname);
};

const initialConfig = async (io, socket) => {
  await setAllSavedMessages(socket);
  socket.on('message', async (messageData) => {
    const formatedMessage = await formatMessage(messageData);
    io.emit('message', formatedMessage);
  });

  const newUser = { nickname: socket.id.slice(0, 16), id: socket.id };
  onlineUsers.push(newUser);
  socket.emit('login', newUser.nickname);
  setAllOnlineUsers(io);
};

module.exports = (io) => {
  io.on('connection', async (socket) => {
    await initialConfig(io, socket);

    socket.on('updateNickname', (newNickname) => {
      const index = onlineUsers.findIndex((user) => user.id === socket.id);
      onlineUsers[index].nickname = newNickname;
      setAllOnlineUsers(io);
    });

    socket.on('disconnect', () => {
      const index = onlineUsers.findIndex((user) => user.id === socket.id);
      onlineUsers.splice(index, 1);
      setAllOnlineUsers(io);
    });
  });
};
