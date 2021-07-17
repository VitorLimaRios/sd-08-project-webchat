const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);
const sockets = require('socket.io');

const chatController = require('./controllers/chatController');

const io = sockets(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

require('./sockets/chat')(io);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(`${__dirname}/views`));

app.get('/', chatController.getAll);

http.listen(3000, () => console.log('Rodando na porta 3000.'));
