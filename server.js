require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    method: ['GET', 'POST'],
  },
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(`${__dirname}/public`));

app.use(cors());

require('./sockets')(io);

const {
  chatController: {
    chatReader,
  },
} = require('./controllers');

app.use(express.static('public'));

app.get('/', chatReader);

http.listen(PORT, () => {
  console.log('App ovindo na porta ', PORT);
});