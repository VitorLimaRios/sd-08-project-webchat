const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET'],
  },
});

app.use(bodyParser.json());
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

require('./sockets/webchat')(io);

app.get('/', (_req, res) => {
  res.render('webchat');
});

const PORT = 3000;
http.listen(PORT, () => {
  console.log('Listening on port %s', PORT);
});
