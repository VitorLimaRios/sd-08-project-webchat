const socket = window.io();

const buttonMsg = document.querySelector('#button-message');
const nickNamebutton = document.querySelector('#nickname-btn');
const userNicknameInput = document.querySelector('#nickname');
const inputText = document.querySelector('#message-box');
let userNickname = '';

nickNamebutton.addEventListener('click', () => {
  localStorage.setItem('nickname', userNicknameInput.value);
});

buttonMsg.addEventListener('click', (e) => {
  let findNickName = localStorage.getItem('nickname');
  e.preventDefault();
  if (!findNickName) {
    findNickName = 'nyancaaaaaaaaaat';
  }
  socket.emit('message', {
    nickname: findNickName,
    chatMessage: inputText.value,
  });
  findNickName = '';
  inputText.value = '';
  return false;
});

nickNamebutton.addEventListener('click', (e) => {
  e.preventDefault();
  userNickname = userNicknameInput.value;
  socket.emit('message', userNickname);
  userNicknameInput.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#list');
  const li = document.createElement('li');
  li.dataset.testid = 'message';
  li.innerText = message;
  messagesUl.appendChild(li);
};

const createUser = (user) => {
  const messagesUl = document.querySelector('#online');
  const li = document.createElement('li');
  li.dataset.testid = 'online-user';
  li.innerText = user;
  messagesUl.appendChild(li);
};

socket.on('message', (message) => createMessage(message));
socket.on('message', (user) => createUser(user));
