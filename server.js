const express = require('express');
const cors = require('cors');

const app = express();
const path = require('path');
const http = require('http').createServer(app);

app.use(express.static(path.join(__dirname, './src/views')));
const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const router = require('./src/routes');

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(cors());

app.use(router);

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});

require('./sockets/server')(io);