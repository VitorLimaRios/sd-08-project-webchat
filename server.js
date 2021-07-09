// FROMMM https://github.com/tryber/sd-08-live-lectures/blob/lecture/31_4/back-end/server.js
// inspirado https://socket.io/docs/v3/emit-cheatsheet/index.html

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
const LanguagesController = require('./controllers/LanguageController.js');  

const PORT = 3001;

app.set('view engine', 'ejs');

app.set('views', './views');
let myId = 'Nick Não definido';
io.on('connection', (socket) => {
    myId = socket.id;
    console.log('a user connected', myId);
    socket.on('chat message', (message) => {
        console.log('mensage', socket.id, message.nickname, message.chatMessage);
        io.emit('chat message', message);
      });
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
  });

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({ ok: true });
});

app.get('/teste', (req, res) => {
    const authors = [{ name: '102' }, 
    { name: '104' }, { name: '106' }, { name: '108' }, { name: '110' }];
    res.status(200).render('index', { authors, myId });
  });

app.use('/languages', LanguagesController);
require('./sockets/votes')(io);

http.listen(PORT, () => console.log('App listening on PORT %s', PORT));