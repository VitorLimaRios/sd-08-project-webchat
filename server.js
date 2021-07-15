const express = require('express');

const app = express();
const path = require('path');
const http = require('http').createServer(app);

app.use(express.static(path.join(__dirname, './public')));
const PORT = process.env.PORT || 3000;

const date = new Date();
const dateFormat = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
const hourFormat = `${date.getHours()}:${date.getMinutes()}`;
const timestamp = `${dateFormat} ${hourFormat}`;

const clients = {};

const nameRandom = () => {
    let result = '';
    const characters = '0123456789abcdefg';
    const charactersLength = characters.length;
    for (let i = 0; i < 16; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `${result}`;
};

const io = require('socket.io')(http, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
});

app.set('view engine', 'ejs');
app.set('views', './public/views');

io.on('connect', (socket) => {
    const newUser = nameRandom();
    clients[socket.id] = newUser;
    socket.emit('connected', newUser);
    console.log(clients);

    socket.broadcast.emit('newUser', newUser);

    socket.on('message', ({ chatMessage, nickname }) => {
        // const oldNick = clients[socket.id];
        const newMessage = `${timestamp} - ${nickname}: ${chatMessage}`;
        io.emit('message', newMessage);
    });

    socket.on('disconnect', () => {
        const clientDisconnected = clients[socket.id];
        delete clients[socket.id];
        io.emit('clientExit', clientDisconnected);
    });    
});

http.listen(PORT, () => console.log(`App listening on Port ${PORT}`));
