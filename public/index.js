const socket = window.io();

const sendButton = document.querySelector('#send-button');
const nickButton = document.querySelector('#nick-button');
const nickname = document.querySelector('#nick-input');
const messageInput = document.querySelector('#message-input');

nickButton.addEventListener('click', () => {
  localStorage.setItem('nickname', nickname.value);
});

sendButton.addEventListener('click', () => {
  let nick = localStorage.getItem('nickname');
  if (!nick) {
    nick = 'Nickname12345678';
  }
  socket.emit('message', {
    nickname: nick,
    chatMessage: messageInput.value,
  });
  nickname.value = '';
  messageInput.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#chat-box');
  const li = document.createElement('li');
  li.dataset.testid = 'message';
  li.innerText = message;
  messagesUl.appendChild(li);
};

socket.on('message', (message) => {
  console.log(message);
  createMessage(message);
});
