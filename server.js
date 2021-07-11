const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);
const socket = require('socket.io');

const chatController = require('./controllers/chatController');

const io = socket(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(__dirname + '/views'));

app.get('/', chatController.getAll);

io.on('connection', async (socket) => { 
 
  socket.on('message', async (msg) => {
    // io.emit('entrar', `${msg.nome} acabou de entrar.`)
    const data = new Date();
    const date = data.toLocaleString().replace('/','-').replace('/','-');
    io.emit('serverMessage', {data: date ,nickname: msg.nickname, chatMessage: msg.chatMessage})
  });

  // socket.on('nome', (msg) => {
  //   io.emit('message', `${msg.nome} acabou de entrar.`)   
  // });


});   

http.listen(3000, () => console.log('Rodando na porta 3000'));
