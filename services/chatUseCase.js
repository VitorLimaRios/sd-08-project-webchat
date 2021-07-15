const { add, get } = require('../models/message');
const { getUsersOn } = require('../services/usersOnUseCase');

exports.saveMessage = async ({ chatMessage, nickname, date }) => {
  await add({ nickname, message: chatMessage, timestamp: date });
};

exports.getChat = async () => {
  const messageChanel = await get();
  const usersOn = await getUsersOn();
  return { usersOn, messageChanel}
}