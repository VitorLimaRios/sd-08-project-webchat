const ChatController = require('../controller/chatController');
const ChatModel = require('../models/chatModel');

const formatSavedMessage = ({ timestamp, nickname, message }) =>
  `${timestamp} - ${nickname}: ${message}`;

const setAllSavedMessages = async (socket) => {
  const allMessages = await ChatModel.getAllMessages();
  const allFormatedMessages = allMessages.map(formatSavedMessage);
  socket.emit('setAllSavedMessages', allFormatedMessages);
};

const setAllOnlineUsers = async (io) => {
  const allUsers = await ChatModel.getAllUsers();
  const allUsersNickname = allUsers.map((user) => user.nickname);
  io.emit('setAllOnlineUsers', allUsersNickname);
};

module.exports = (io) => {
  io.on('connection', async (socket) => {
    await setAllSavedMessages(socket);
    socket.on('login', async (initialNickname) => {
      await ChatModel.addNewUser(initialNickname);
      await setAllOnlineUsers(io);
    });
    socket.on('message', async (messageData) => {
      const formatedMessage = await ChatController.formatMessage(messageData);
      io.emit('message', formatedMessage);
    });
    socket.on('updateNickname', async (nicknames) => {
      await ChatModel.updateUser(nicknames);
      await setAllOnlineUsers(io);
    });
    socket.on('disconectUser', async (unlogUserNickname) => {
      await ChatModel.deleteUser(unlogUserNickname);
      await setAllOnlineUsers(io);
    });
  });
};
