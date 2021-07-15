const client = window.io();

const form = document.querySelector('#formSendMessage');
const newNick = document.querySelector('#changeNick');
const messages = document.querySelector('#messageInput');
const list = document.querySelector('#listMessages');

const createMessage = (message, from, hour) => {
    const msgElement = document.createElement('div');
    msgElement.classList.add('msg');
    const msgComponent = `${hour} - ${from}: ${message}`;
    msgElement.innerHTML = msgComponent;
    msgElement.setAttribute('data-testid', 'message');
    return msgElement;
};

client.on('connected', (user) => {
    console.log(user.name);
    const newMessage = createMessage(user.message, user.nickname, user.hour);
    list.append(newMessage);
});

client.on('newUser', (user) => {
    console.log(user.name);
    const newMessage = createMessage('Entrou no chat', user.nickname, user.hour);
    list.append(newMessage);
});

client.on('clientExit', (obj) => {
    const newMessage = createMessage('Saiu do chat', obj.nickname, obj.hour);
    list.append(newMessage);
});

form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    client.emit('message', { 
        chatMessage: messages.value, nickname: newNick.value,
    });
});

client.on('message', (obj) => {
    list.append(obj);
});