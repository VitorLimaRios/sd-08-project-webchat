const moment = require('moment');

function formatMessage(nickname, message) {
  const msg = {
    message,
    nickname,
    timestamp: moment().format('DD-MM-YYYY hh:mm:ss'),
    img: 'https://i.pravatar.cc/50',
  };
  return `${msg.timestamp} - ${msg.nickname}: ${msg.message}`;
}

module.exports = formatMessage;
