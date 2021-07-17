const socket = window.io();

const form = document.querySelector('#form2');
const nome = document.querySelector('#nickname');
const msg = document.querySelector('#mensagem');
const users = document.querySelector('#user');

let nickname = null;

form.addEventListener('submit', (event) => {
    event.preventDefault();
    socket.emit('message', { chatMessage: msg.value, nickname }); 
    nome.value = '';
    msg.value = '';
    return false;
}); 

const createMessage = (user) => {
    const chat = document.querySelector('#chat');
    const li = document.createElement('li');
    li.innerText = user;
    li.dataset.testid = 'message';
    chat.appendChild(li);
};

const createUser = (name) => {
    const li = document.createElement('li');  
    li.innerText = name;
    li.dataset.testid = 'online-user';
    users.appendChild(li);
};

const updateUsersList = (nickName, usersList) => {
    users.innerHTML = '';
    createUser(nickName);
    usersList.forEach((e) => {
        if (e !== nickName) {
            createUser(e);
        }
    });
};

const updateUser = () => {
    const nick = nome.value;   
    socket.emit('update', nick);
    nome.value = '';
};

const btn = document.querySelector('#btnNick');
btn.addEventListener('click', () => {
    updateUser();
}); 

socket.on('message', (user) => createMessage(user));

socket.on('history', (user) => createMessage(user));

socket.on('updateUser', (usersList, nickName) => updateUsersList(nickName, usersList));

socket.on('updateNickName', (nickName) => {
    nickname = nickName;
}); 
