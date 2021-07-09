const socket = window.io();

const sendButton = document.querySelector('#button-message');
const nickNamebutton = document.querySelector('#nickname-btn');
const nickname = document.querySelector('#nickname');
const inputText = document.querySelector('#message-box');

nickNamebutton.addEventListener('click', () => {
  localStorage.setItem('nickname', nickname.value);
});

sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  let findNickName = localStorage.getItem('nickname');
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

const createMessage = (message) => {
  const messagesUl = document.querySelector('#list');
  const li = document.createElement('li');
  li.dataset.testid = 'message';
  li.innerText = message;
  messagesUl.appendChild(li);
};

socket.on('message', (message) => createMessage(message));
