const express = require('express');

const app = express();
const http = require('http').createServer(app);
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET'],
  },
});

app.use(express.static(path.resolve(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', './views');

require('./sockets/chat')(io);

app.get('/', (_req, res) => {
  res.status(200).render('chat/index', {});
});

http.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}`));