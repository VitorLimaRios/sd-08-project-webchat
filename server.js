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

const PORT = 3000;

const listOnline = [];

app.set('view engine', 'ejs');
app.set('views', './views');
require('./sockets/message')(io, listOnline);

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).render('index', { listOnline });
  });

http.listen(PORT, () => console.log('App listening on PORT %s', PORT));