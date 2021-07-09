require('dotenv/config');
const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${process.env.PORT}`,
    method: ['GET', 'POST'],
  },
});

app.use(cors());

require('./sockets')(io);

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`App ovindo na porta ', ${PORT}`);
});
