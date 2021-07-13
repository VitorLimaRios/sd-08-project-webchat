const socket = window.io();

const form = document.querySelector('form');
const inputMessage = document.querySelector('.messageInput');
const nick = document.querySelector('#nickname');
const button = document.querySelector('.buttonSave');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', {
    chatMessage: inputMessage.value,
    nickname: nick.innerHTML,
  });
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('.messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li);
};

const changeNick = () => {
  const nickName = document.querySelector('.nickNameInput');
  const oldNick = nick.innerHTML;
  nick.innerText = nickName.value;
  nickName.value = '';
  socket.emit('user', {
    newNick: nick.innerText,
    oldNick,
  });
};

const createUsers = (user) => {
  const userUl = document.querySelector('#users');
  const li = document.createElement('li');
  li.innerText = user;
  li.setAttribute('data-testid', 'online-user');
  userUl.appendChild(li);
};

button.addEventListener('click', (e) => {
  e.preventDefault();
  changeNick();
});

nick.innerHTML = Math.random().toString(6).substring(2, 18);

socket.emit('user', {
  newNick: nick.innerHTML,
  oldNick: null,
});

socket.on('message', (message) => createMessage(message));
socket.on('user', (users) => {
  const myUsers = document.querySelector('#users');
  myUsers.innerHTML = '';

  createUsers(nick.innerHTML);

  const index = users.map((user) => user.newNick).indexOf(nick.innerHTML);
  users.splice(index, 1);

  users.forEach((user) => {
    createUsers(user.newNick);
  });
});
