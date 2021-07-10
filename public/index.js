const socket = window.io();

const chat = document.querySelector('#chat');
const message = document.querySelector('#message');
const button = document.querySelector('#button');
const nickname = document.querySelector('#nickname');

button.addEventListener('click', () => {
  const newMessage = message.value;
  const newNickName = nickname.value;
  socket.emit('message', { chatMessage: newMessage, nickname: newNickName });
});

socket.on('message', (messageChat) => {
  console.log(messageChat);
  const li = document.createElement('li');
  li.classList.add('message');
  li.innerText = messageChat;
  chat.appendChild(li);
});