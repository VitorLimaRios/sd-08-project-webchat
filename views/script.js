const socket = window.io();

const form = document.querySelector('form');
const nome = document.querySelector('#nickname');
const msg = document.querySelector('#mensagem');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    socket.emit('message', { nickname: nome.value, chatMessage: msg.value }); 
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
    const chat = document.querySelector('#user');
    const li = document.createElement('li');
    li.innerText = name;
    li.dataset.testid = 'online-user';
    chat.appendChild(li);
};

// newUser
socket.on('userNew', (user) => createUser(user));

socket.on('bye', (user) => createUser(user));

socket.on('serverMessage', (user) => createMessage(user));

// const saveLocalStorage = (name) => {
//   localStorage.setItem('nome', JSON.stringify(name));    
// } 
// saveLocalStorage(nameRandom())

// const nome = JSON.parse(localStorage.getItem('nome'));
// socket.emit('nome', {nome}); 