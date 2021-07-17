const moment = require('moment');
const chatModel = require('../models/chatModel');

const findMessagens = async () => {
    const messages = await chatModel.getAll();
    return messages;
};

const create = async (msg) => {
    const result = await chatModel.create(msg);
    return result;
};

let users = [];

const addUser = (socket) => {
    const nickName = socket.id.substring(0, 16);
    const newUser = { nickName, socket };
    users.push(newUser);
    return newUser;
};

const removeUser = (socket) => {
    users = users.filter((user) => user.socket !== socket);
};

const getNickNames = () => users.map((user) => user.nickName);

const getUser = (socket) => users.find((user) => user.socket === socket);

const changeUserName = (socket, newNickName) => {
    const user = getUser(socket);
    user.nickName = newNickName;
};

const history = async (socket) => {
    const messages = await findMessagens();
    messages.forEach(({ message, nickname, timestamp }) => {
        socket.emit('message', `${timestamp} ${nickname} ${message}`);
    });
};

const init = (socket, clientNickName) => {
    const nickNames = getNickNames();
    socket.emit('updateUser', nickNames, clientNickName);
};

const update = () => {
    const nickNames = getNickNames();    
    users.forEach(({ nickName, socket }) => (
        socket.emit('updateUser', nickNames, nickName)
    ));
};

const message = ({ chatMessage, nickname }, io) => {
    const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');
    create({ message: chatMessage, nickname, timestamp });
    const userResult = `${timestamp} - ${nickname}: ${chatMessage}`;
    io.emit('message', userResult);
};

const updateNickName = (socket, nickName) => {
    socket.emit('updateNickName', nickName);
};

module.exports = (io) => {
    io.on('connection', (socket) => {
        const newUser = addUser(socket);
        init(socket, newUser.nickName);
        history(socket);
        update();
        updateNickName(socket, newUser.nickName);
        socket.on('update', (nickName) => {
            changeUserName(socket, nickName);
            updateNickName(socket, newUser.nickName);
            update();
        });
        socket.on('message', (newMessage) => message(newMessage, io));
        socket.on('disconnect', () => removeUser(socket));
    });
};