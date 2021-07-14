const socket = window.io();

const nameInput = document.querySelector('.nickname-box');
const messageUl = document.querySelector('.messages');
const messageInput = document.querySelector('.message-box');
const usersUl = document.querySelector('.users');

let nickname;

document.querySelector('.send-button').addEventListener('click', () => {
  const chatMessage = messageInput.value;
  socket.emit('message', { chatMessage, nickname });
  messageInput.value = '';
});

document.querySelector('.nickname-button').addEventListener('click', () => {
  const newNickname = nameInput.value;
  socket.emit('updateUsersList', { nickname, newNickname });
  nickname = nameInput.value;
});

const createMessage = (message) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messageUl.appendChild(li);
};

socket.on('generateName', (randomName) => {
  nameInput.value = randomName;
  nickname = randomName;
});

socket.on('message', (message) => createMessage(message));

socket.on('restoreMessages', (messageHistory) => {
  messageHistory.forEach(({ message }) => createMessage(message));
});

socket.on('userList', (userList) => {
  console.log(`Por algum motivo o tamanho eh ${usersUl.childNodes.length}`);
  usersUl.innerHTML = '';
  console.log(`Por algum motivo o tamanho eh ${usersUl.childNodes.length}`);
  userList.forEach((obj) => {
    const name = obj.nickname;
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    li.innerText = name;
    usersUl.appendChild(li);
  });
});
