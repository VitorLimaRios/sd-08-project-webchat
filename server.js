// Faça seu código aqui
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.set('views', './views');

const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

app.use(cors());

require('./socket')(io);

app.use(express.static(`${__dirname}/views`));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/client.html`);
});

http.listen(PORT, () => {
  console.log('App ovindo na porta ', PORT);
});
