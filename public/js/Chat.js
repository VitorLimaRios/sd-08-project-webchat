const socket = window.io();

const form = document.querySelector('form');
const messageBoard = document.querySelector('#messages');
const userBoard = document.querySelector('#users');
const inputMessage = document.querySelector('#message-box');
const nicknameBox = document.querySelector('#nickname-box');
const nicknameButton = document.querySelector('#nickname-button');

let nickname = '';

form.addEventListener('submit', (event) => {
  event.preventDefault();
  socket.emit('message', {
    chatMessage: inputMessage.value,
    nickname,
  });
  inputMessage.value = '';
});

nicknameButton.addEventListener('click', () => {
  nickname = nicknameBox.value;
  nicknameBox.setAttribute('placeholder', nickname);
  nicknameBox.value = '';
  socket.emit('updateNickname', nickname);
});

const createMessage = (message) => {
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messageBoard.appendChild(li);
};

const newUser = (initialNick) => {
  nickname = initialNick;
  nicknameBox.setAttribute('placeholder', nickname);
  socket.emit('updateUsers');
};

const modifyUserList = (user) => {
  const li = document.createElement('li');
  li.innerText = user.nickname;
  li.setAttribute('data-testid', 'online-user');
  userBoard.appendChild(li);
};

const updateUsers = (onlineUsers) => {
  userBoard.innerHTML = '';

  const userCheck = (user) => user.id === socket.id;
  const clientUser = onlineUsers.find(userCheck);

  modifyUserList(clientUser);
  onlineUsers.forEach((user) => user.id !== socket.id && modifyUserList(user));
};

socket.on('message', createMessage);
socket.on('userConnected', newUser);
socket.on('updateUsers', updateUsers);
