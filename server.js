const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const viewsRoute = require('./routes/viewsRoute');

// require('./sockets/chat')(io);

const getDate = () => {
  const date = new Date()
  .toLocaleString({}, { hour12: true })
  .replace(/\//g, '-');
  return date;
};

io.on('connection', (socket) => {
  console.log(`novo usuário conectado! ${socket.id}`);
  socket.on('message', ({ chatMessage, nickname }) => {
    const date = getDate();
    const message = `${date} - ${nickname}: ${chatMessage}`;
    io.emit('message', message);
  });
});

app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/views/`));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(viewsRoute);

const port = process.env.PORT || 3000;

http.listen(port, () => {
  console.log(`Usando a porta ${port}`);
});