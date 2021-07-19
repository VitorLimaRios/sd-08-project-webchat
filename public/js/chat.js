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
  li.setAttribute('data-testid', 'online-user1');
  ul.appendChild(li);
};

socket.on('renderUsers', (users) => {
  [...ul.children].forEach((element) => element.remove());
  createElements(nickname);
  users.forEach((user) => {
    if (user !== nickname) createElements(user);
  });
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

socket.on('history', (history) => {
  createMessage(history);
});

socket.on('message', (message) => createMessage(message));