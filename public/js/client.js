const client = window.io();

const form = document.querySelector('form');
const newNick = document.querySelector('#changeNick');
const messages = document.querySelector('#messageInput');
const list = document.querySelector('#listMessages');
const mensagens = [];

const createMessage = (message) => {
    const msgElement = document.createElement('li');
    msgElement.classList.add('msg');
    const msgComponent = message;
    msgElement.innerHTML = msgComponent;
    msgElement.setAttribute('data-testid', 'message');
    return msgElement;
};

client.on('connected', (user) => {
    const li = document.createElement('li');
    li.innerText = user;
    li.setAttribute('id', 'online');
    li.dataset.testid = 'online-user';
    list.appendChild(li);
});

client.on('newUser', (user) => {
    console.log(user);
    const newMessage = `${createMessage(user).innerText}, entrou no chat!`;
    list.append(newMessage);
});

client.on('clientExit', (obj) => {
    const newMessage = `${createMessage(obj).innerText}, saiu do chat!`;
    list.append(newMessage);
});

form.addEventListener('submit', (e) => {
    let onlineUser = document.querySelector('#online').innerText;
    console.log('Console do online user', onlineUser.innerText);
    e.preventDefault(); 

        onlineUser = newNick.value;
        client.emit('message', { 
            chatMessage: onlineUser, nickname: messages.value,
        });
});

client.on('message', (obj) => {
    console.log('Todas mensagens', mensagens);
    const msgElement = document.createElement('li');
    const msgComponent = obj;
    msgElement.innerHTML = msgComponent;
    msgElement.setAttribute('data-testid', 'message');
    mensagens.push(msgElement);
    
    list.append(msgElement);
});
