const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');

const app = express();
const http = require('http').createServer(app);
require('dotenv/config');

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    method: ['GET', 'POST'],
  },
});

app.use(cors());

require('./sockets')(io);

app.use(express.static(`${__dirname}/public`));

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

http.listen(PORT, () => {
  console.log(`Ouvindo na porta ${PORT}`);
});
