const socket = window.io();

const form = document.querySelector('form');
const messageBoard = document.querySelector('#messages');
const inputMessage = document.querySelector('#message-box');
const nicknameBox = document.querySelector('#nickname-box');
const nicknameButton = document.querySelector('#nickname-button');

let nickname = '';

form.addEventListener('submit', (event) => {
  event.preventDefault();
  socket.emit('message', {
    nickname,
    message: inputMessage.value,
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

socket.on('message', createMessage);
