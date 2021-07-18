const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const messageControllers = require('./controllers/messageControllers');

require('./sockets/chat')(io);

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(`${__dirname}/public`));

app.get('/', (_req, res) => res.sendFile(`${__dirname}/index.html`));

app.use('/msg', messageControllers);

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => console.log('Servidor ouvindo na porta 3000'));
