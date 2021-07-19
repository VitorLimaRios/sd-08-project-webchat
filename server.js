const express = require('express');

const app = express();
const path = require('path');
const http = require('http').createServer(app);

app.use(express.static(path.join(__dirname, './public')));
const PORT = process.env.PORT || 3000;

const date = new Date();
const dateFormat = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
const hourFormat = `${date.getHours()}:${date.getMinutes()}`;
const timestamps = `${dateFormat} ${hourFormat}`;

const users = [];

const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

const chatModel = require('./models/chatModel');

app.set('view engine', 'ejs');
app.set('views', './public/views');

const create = async (msg) => {
    const result = await chatModel.create(msg);
    return result;
};

const getMessages = async () => {
    const messages = await chatModel.getAllMessages();  
    return messages;
};

const onlineUsers = 'online-users';

const newUser = (socket) => {
    console.log('Console de todos users');

    socket.on('newUser', (nicknames) => {
        users.push({ id: socket.id, nicknames });
        socket.broadcast.emit('newUser', nicknames);
        getMessages().then((msg) => msg.map(({ message, nickname, timestamp }) => {
        const messages = `${timestamp} ${nickname} ${message}`;
        console.log('Console de todos users');
        return socket.emit('historyMsg', messages);
    }));
    });
};

const disconnectUser = (socket) => {
    socket.on('disconnect', () => {
        const removeIndex = users.findIndex((user) => user.id === socket.id);
        const userToRemove = users.filter((user) => user.id === socket.id);
        users.splice(removeIndex, 1);
        io.emit(onlineUsers, users);
        // estava dando problema linha de baixo
        socket.broadcast.emit('clientExit', userToRemove);
    });
};

io.on('connect', (socket) => {
    newUser(socket);

    socket.on('message', ({ chatMessage, nickname }) => {
        create({ message: chatMessage, nickname, timestamps });
        const newMessage = `${timestamps} - ${nickname}: ${chatMessage}`;
        io.emit('message', newMessage);
    });
    
    socket.on('updateNick', (userUp) => {
        const index = users.findIndex((user) => user.id === socket.id);
        users[index].nicknames = userUp;
        io.emit(onlineUsers, users);
    });
    
    socket.on(onlineUsers, () => io.emit(onlineUsers, users));
    
    disconnectUser(socket);
});

http.listen(PORT, () => console.log(`App listening on Port ${PORT}`));
