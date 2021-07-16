const client = window.io();

const form = document.querySelector('form');
const newNick = document.querySelector('#changeNick');
const newNickbtn = document.querySelector('#btnNickName');
const messages = document.querySelector('#messageInput');
const list = document.querySelector('#listMessages');
const userList = document.querySelector('#users');
let online = [];

const createMessage = (message) => {
    const msgElement = document.createElement('li');
    msgElement.classList.add('msg');
    const msgComponent = message;
    msgElement.innerHTML = msgComponent;
    msgElement.setAttribute('data-testid', 'message');
    return msgElement;
};

const nameRandom = () => {
    let result = '';
    const characters = '0123456789abcdefg';
    const charactersLength = characters.length;
    for (let i = 0; i < 16; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `${result}`;
};

window.onload = () => {
    const random = nameRandom();
    client.emit('newUser', random);
    client.emit('online-users', '');
    localStorage.setItem('user', JSON.stringify(random));
};

client.on('newUser', (user) => {
    online.push(user);
    const li = document.createElement('li');
    li.innerText = online;
    li.setAttribute('id', 'online');
    li.dataset.testid = 'online-user';
    list.appendChild(li);
    const newMessage = `${createMessage(user).innerText}, entrou no chat!`;
    list.append(newMessage);
});

client.on('online-users', (users) => {
    console.log('Console de todos users', users, client);
    userList.innerText = '';
    const userOn = users.find((user) => user.id === client.id);
    const allUsers = users.filter((user) => user.id !== client.id);

    // Adiciona o usuario no inicio do array
    allUsers.unshift(userOn);
    allUsers.map((item) => {
        console.log('Console de todos itens', item);
        const li = document.createElement('li');
        li.innerText = item.nickname;
        return userList.appendChild(li);
    });
});

client.on('clientExit', (obj) => {
    console.log('Console do obj recebido', obj);
    const newMessage = `${createMessage(obj[0].newUser).innerText}, saiu do chat!`;
    list.append(newMessage);
});

form.addEventListener('submit', (e) => {
    let onlineUser = document.querySelector('#online').innerText;
    e.preventDefault(); 
    if (newNick.value === '') {
        client.emit('message', { 
            chatMessage: messages.value, nickname: onlineUser,
        });
    } else {
        onlineUser = newNick.value;
        client.emit('message', { 
            chatMessage: messages.value, nickname: onlineUser,
        });
    }
});

newNickbtn.addEventListener('click', () => {
    const newNickname = newNick.value;
    console.log(online, newNickname);
    online = newNickname;
    client.emit('updateNick', online);
});

client.on('message', (obj) => {
    const msgElement = document.createElement('li');
    const msgComponent = obj;
    msgElement.innerHTML = msgComponent;
    msgElement.setAttribute('data-testid', 'message');
    
    list.append(msgElement);
});

client.on('historyMsg', (e) => { 
    const newMessage = createMessage(e);
    list.append(newMessage);
});
