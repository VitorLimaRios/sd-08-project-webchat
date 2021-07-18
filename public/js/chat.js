const socket = window.io();

const inputNickname = document.querySelector('#nickname');
const buttonNickname = document.querySelector('#send-nickname');
const messagesUl = document.querySelector('#messages');
const usersUl = document.querySelector('#users');
const inputMessage = document.querySelector('#message-box');
const buttonMessage = document.querySelector('#send-button');
let nickname = null;

buttonNickname.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('saveNickname', { nickname: inputNickname.value });
  inputNickname.value = '';
  return false;
});

buttonMessage.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: inputMessage.value, nickname });
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const li = document.createElement('li');
  li.innerText = message;
  li.dataset.testid = 'message';
  messagesUl.appendChild(li);
};

const createUsers = (user) => {
  const li = document.createElement('li');
  li.innerText = user;
  li.dataset.testid = 'online-user';
  usersUl.appendChild(li);
};

socket.on('sendNickname', (user) => {
  nickname = user;
});

socket.on('message', (message) => createMessage(message));

socket.on('updatedUsers', (users) => {
  usersUl.innerText = '';
  createUsers(nickname);
  users.forEach((user) => {
    if (nickname !== user) { createUsers(user); }
  });
});

socket.on('allMessages', (messages) => {
  messages.forEach(createMessage);
});