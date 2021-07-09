const socket = window.io();

const userNicknameTag = '#userNickname';

socket.on('getconnection', () => {
  socket.emit('getNickname');
});

socket.on('yourNickname', (nickname) => {
  const userNickname = document.querySelector(userNicknameTag);
  userNickname.textContent = nickname;

  localStorage.setItem('nickname', nickname);
  socket.emit('getUsers');
});

socket.on('sendNickname', () => {
  const nickname = localStorage.getItem('nickname');
  socket.emit('myNickname', nickname);
});

socket.on('newUser', (nickname) => {
  const ulUser = document.querySelector('#usersList');
  const liUser = document.createElement('li');
  liUser.textContent = nickname;
  ulUser.appendChild(liUser);
});

socket.on('message', (message) => {
  const ulMessage = document.querySelector('#messagesList');
  const liMessage = document.createElement('li');
  liMessage.setAttribute('data-testid', 'message');
  liMessage.textContent = message;
  ulMessage.appendChild(liMessage);
});

const form = document.getElementById('messageForm');
const input = document.getElementById('messageInput');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    const nickname = document.querySelector(userNicknameTag).value;
    const chatMessage = input.value;
    socket.emit('message', { chatMessage, nickname });
    input.value = '';
  }
});

const nicknameForm = document.getElementById('userNickname');
const nicknameInput = document.getElementById('nickname');

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (nicknameInput.value) {
    console.log(nicknameInput.value);
    localStorage.setItem('nickname', nicknameInput.value);
    document.querySelector(userNicknameTag).textContent = nicknameInput.value;
    nicknameInput.value = '';
  }
});
