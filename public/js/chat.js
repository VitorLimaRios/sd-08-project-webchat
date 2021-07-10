const socket = window.io();

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nickname = document.querySelector('#nickName').value;
  const chatMessage = document.querySelector('#messageInput').value;
  socket.emit('message', { chatMessage, nickname });
  document.querySelector('#messageInput').value = '';
  return false;
});

const newUser = (nickName) => {
  console.log(nickName);
};

const createMessage = (data) => {
  // console.log('message', data);
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = data;
  messagesUl.appendChild(li);
};

socket.on('message', (data) => createMessage(data));
socket.on('newUser', (nickName) => newUser(nickName));
