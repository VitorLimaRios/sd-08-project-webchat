const socket = window.io();

const chat = document.querySelector('#chat');
const message = document.querySelector('#message');
const button = document.querySelector('#button');
const nicknameInput = document.querySelector('#nickname');
const nicknameOnline = document.querySelector('#username');
const buttonNickname = document.querySelector('#buttonNick');
const users = document.querySelector('#users');

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
} // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

window.onload = () => {
  nicknameOnline.innerHTML = makeid(16);
  localStorage.setItem('nickname', nicknameOnline.innerHTML); 
};

buttonNickname.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.setItem('nickname', nicknameInput.value); 
  socket.emit('user', nicknameInput.value);
  nicknameInput.value = '';
  return false;
});

button.addEventListener('click', () => {
  const nickname = localStorage.getItem('nickname');
  const chatMessage = message.value;
  socket.emit('message', { chatMessage, nickname });
  message.value = '';
  return false;
});

const renderMessage = (msg) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = msg;
  chat.appendChild(li);
};

const renderUsers = (user) => {
  const li = document.createElement('li');
  li.innerText = user;
  li.setAttribute('data-testid', 'online-user');
  users.appendChild(li);
};

socket.on('message', (msg) => {
  renderMessage(msg);
});

socket.on('user', (msg) => {  
  renderUsers(msg);
});

socket.on('start', (allMessages) => {
  allMessages.forEach((elem) => {
    renderMessage(elem);
  });
});