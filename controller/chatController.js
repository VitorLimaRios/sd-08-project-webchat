const ChatModel = require('../models/chatModel');

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

module.exports = {
  formatMessage,
};
