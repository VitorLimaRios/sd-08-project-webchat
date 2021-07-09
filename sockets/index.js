const chat = require('./chat');

module.exports = (io) => {
  chat(io);
};