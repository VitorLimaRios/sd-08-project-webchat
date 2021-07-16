const { saveMessageBD, getMessageBD } = require('../models/messageModels');

const saveMessage = async (messages, datePrint) => {
  try {
    const { chatMessage: message, nickname } = messages;
    const timestamp = datePrint;
    await saveMessageBD(message, nickname, timestamp);
  } catch (error) {
    console.log(error);
  }
};

const getMessage = async () => {
  try {
    const loadMessages = await getMessageBD();
    return loadMessages;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  saveMessage,
  getMessage,
};