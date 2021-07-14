// Faça seu código aqui
const moment = require('moment');
const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET'],
  },
});

const userChat = require('./models/userChat');

io.on('connection', async (client) => {
  const newUser = `User_${client.id}`;
  await userChat.addUser(newUser);

  client.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${moment().format('DD-MM-YYYY HH:mm:ss')} - ${nickname}: ${chatMessage}`);
  });
});

const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({ ok: true });
});

http.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
