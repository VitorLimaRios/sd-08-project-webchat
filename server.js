const app = require('express')();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`${socket.id} se conectou`);

  socket.on('message', ({ chatMessage, nickname }) => {
    const now = new Date();
    const date = `${now.getDay()}-${now.getMonth()}-${now.getFullYear()}`;
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    const message = `${date} ${time} - ${nickname}: ${chatMessage}`;
    io.emit('message', message);
  });
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.json());
app.use(cors());

http.listen(3000, () => { console.log('Ouvindo na porta 3000'); });