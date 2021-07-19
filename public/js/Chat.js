const socket = window.io();

const form = document.querySelector('form');
const messageBoard = document.querySelector('#messages');
const inputMessage = document.querySelector('#message-box');
const nicknameBox = document.querySelector('#nickname-box');
const nicknameButton = document.querySelector('#nickname-button');
const onlineUser = document.querySelector('#online-user');

let nickname = '';

form.addEventListener('submit', (event) => {
  event.preventDefault();
  socket.emit('message', {
    chatMessage: inputMessage.value,
    nickname,
  });
  inputMessage.value = '';
});

nicknameButton.addEventListener('click', () => {
  nickname = nicknameBox.value;
});

const createMessage = (message) => {
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messageBoard.appendChild(li);
};

const newUser = (initialNick) => {
  nickname = initialNick;
  onlineUser.innerHTML = nickname;
  nicknameBox.value = nickname;
};

socket.on('message', createMessage);
socket.on('userConnected', newUser);
