require('dotenv/config');

const app = require('./src/app');
const http = require('http').createServer(app);

const { DEFAULT_PORT } = require('./src/shared/defs');

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${DEFAULT_PORT}`,
    method: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('conectado');

  socket.on('disconnect', () => {
    console.log('to off');
  });
});

require('./sockets')(io);

http.listen(DEFAULT_PORT, () => {
  console.log(`App Listen Post: ${DEFAULT_PORT}`);
});
