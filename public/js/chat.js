const socket = window.io();

const userInput = document.querySelector('.nickname-box');
const usersUl = document.querySelector('.users');
const messageInput = document.querySelector('.message-box');
const messageUl = document.querySelector('.messages');

let nickname;

const addMessage = () => {
  const chatMessage = messageInput.value;
  if (chatMessage.length === 0) return;
  socket.emit('message', { chatMessage, nickname });
  messageInput.value = '';
};

document.querySelector('.send-button').addEventListener('click', addMessage);

document.querySelector('.nickname-button').addEventListener('click', () => {
  const newNickname = userInput.value;
  socket.emit('updateUsersList', { nickname, newNickname });
  nickname = userInput.value;
  userInput.value = '';
});

const createMessage = (message) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messageUl.appendChild(li);
};

socket.on('chatInit', ({ randomName, messageHistory }) => {
  nickname = randomName;
  messageHistory.forEach(({ message }) => createMessage(message));
});

socket.on('message', (message) => createMessage(message));

const createNickname = (name, user = false) => {
  const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    li.innerText = (user) ? `${name} (you)` : name;
    usersUl.appendChild(li);
};

socket.on('userList', (userList) => {
  usersUl.innerHTML = '';
  createNickname(userList.find(({ socketId }) => socket.id === socketId).nickname, true);
  userList.forEach((obj) => {
    if (socket.id === obj.socketId) return;
    createNickname(obj.nickname);
  });
});
