const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');

const app = express();
const http = require('http').createServer(app);
require('dotenv/config');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

app.use(cors());

require('./sockets')(io);

app.use(express.static(`${__dirname}/public`));

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

http.listen(process.env.PORT, () => {
  console.log(`Ouvindo na porta ${process.env.PORT}`);
});
