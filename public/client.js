const socket = window.io();

const form = document.querySelector('form');
const inputNickName = document.querySelector('#nickName');
const inputTexto = document.querySelector('#messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', {
    nickname: inputNickName.value,
    chatMessage: inputTexto.value,
  });
  inputTexto.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messageAdd');
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.innerText = message;
  messagesUl.appendChild(li);
};

socket.on('message', (msg) => createMessage(msg));

socket.on('welcome', (msg) => createMessage(msg));

socket.on('newConnection', ({ message }) => createMessage(message));
