const socket = window.io();

const form = document.querySelector('#form2');
const nome = document.querySelector('#nickname');
const msg = document.querySelector('#mensagem');
// const ulUser = document.querySelector('#user');

// socket.on('updateUser', (user) => console.log(user));

form.addEventListener('submit', (event) => {
    // const nicknames = ulUser.firstChild.textContent;
    const nick = socket.id.substring(0, 16);
    event.preventDefault();
    socket.emit('message', { chatMessage: msg.value, nickname: nick }); 
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

const chat = document.querySelector('#user');
const createUser = (name) => {
    const li = document.createElement('li');  
    li.innerText = name;
    li.dataset.testid = 'online-user';
    chat.appendChild(li);
};

socket.on('message', (user) => createMessage(user));

socket.on('historyMsg', (mensagens) => createMessage(mensagens));

socket.on('userNew', (user) => {
    const users = JSON.parse(localStorage.getItem('user')) || []; 
    const result = users.some((element) => element === user);
    if (!result) {
        users.unshift(user);
        localStorage.setItem('user', JSON.stringify(users));    
    }
    const historyUser = JSON.parse(localStorage.getItem('user'));
    chat.innerHTML = '';
    createUser(user);
    historyUser.forEach((e) => {
        if (e !== user) {
            createUser(e);
        }
    });
});

socket.on('bye', (user) => {
    const users = JSON.parse(localStorage.getItem('user'));
    const indice = users.findIndex((element) => element === user);
    users.splice(indice, 1);
    localStorage.setItem('user', JSON.stringify(users));   
    chat.innerHTML = '';
    users.map((e) => {
        createUser(e);
    });
});

const updateUser = () => {
    const nick = nome.value;   
    socket.emit('update', nick);
    nome.value = '';
};

const btn = document.querySelector('#btnNick');
btn.addEventListener('click', () => {
    updateUser();
}); 

socket.on('updateUser', (user, nickname) => {
    const users = JSON.parse(localStorage.getItem('user'));
    const indice = users.findIndex((element) => element === nickname);
    users[indice] = user;    
    chat.innerHTML = '';
    localStorage.setItem('user', JSON.stringify(users)); 
    createUser(user); 
    users.forEach((e) => {
        if (e !== user) {
            createUser(e);
        }
    });
});
