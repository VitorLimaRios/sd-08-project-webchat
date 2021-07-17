const socket = window.io();

const ul = document.querySelector('.online');
const nickInput = document.querySelector('[data-testid="nickname-box"]');
const messagesUl = document.querySelector('.messages');
const messageInput = document.querySelector('[data-testid="message-box"]');
const form = document.querySelectorAll('form');

let nickname = null;

const createElements = (user) => {
  const li = document.createElement('li');
  li.innerText = user;
  ul.appendChild(li);
};

socket.on('renderUsers', (users) => {
  [...ul.children].forEach((element) => element.remove());
  console.log(users);
  users.map((user) => createElements(user));
});

const createMessage = (message) => {
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  li.setAttribute('class', 'message');
  messagesUl.insertBefore(li, messagesUl.lastChild);
};

form[0].addEventListener('submit', (e) => {
  e.preventDefault();
  nickname = nickInput.value;
  socket.emit('changeNickname', nickname);
});

form[1].addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: messageInput.value, nickname });
  messageInput.value = '';
});

socket.on('nickname', (user) => {
  nickname = user.nickname;
});

socket.on('message', (message) => createMessage(message));

window.onbeforeunload = () => socket.disconnect();