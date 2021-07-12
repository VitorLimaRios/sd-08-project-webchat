const socket = window.io();

const userNicknameTag = '#userNickname';
const dataTestAttribute = 'data-testid';

socket.on('yourNickname', (nickname) => {
  const userNickname = document.querySelector(userNicknameTag);
  userNickname.setAttribute(dataTestAttribute, 'online-user');
  userNickname.textContent = nickname;

  localStorage.setItem('nickname', nickname);

  socket.emit('getUsers', nickname);
  socket.emit('getMessagesHistory');
});

socket.on('usersOnline', (usersOnline) => {
  const usersList = document.querySelector('#usersList');

  while (usersList.lastElementChild) {
    usersList.removeChild(usersList.lastElementChild);
  }
  const nickname = localStorage.getItem('nickname');

  usersOnline.forEach((user) => {
    if (user.nickname !== nickname) {
      const liUser = document.createElement('li');
      liUser.textContent = user.nickname;
      liUser.setAttribute(dataTestAttribute, 'online-user');
      usersList.appendChild(liUser);
    }
  });
});

socket.on('newUser', (nickname) => {
  const usersList = document.querySelector('#usersList');
  const liNewUser = document.createElement('li');
  liNewUser.textContent = nickname;
  usersList.appendChild(liNewUser);
});

socket.on('updateUsers', () => socket.emit('getUsers'));

socket.on('messageHistory', (messages) => {
  const ulMessage = document.querySelector('#messagesList');

  messages.forEach((msg) => {
    const liMessage = document.createElement('li');
    liMessage.setAttribute(dataTestAttribute, 'message');
    liMessage.textContent = `${msg.timestamp} - ${msg.nickname}: ${msg.message}`;
    ulMessage.appendChild(liMessage);
  });
});

socket.on('message', (message) => {
  const ulMessage = document.querySelector('#messagesList');
  const liMessage = document.createElement('li');
  liMessage.setAttribute(dataTestAttribute, 'message');
  liMessage.textContent = message;
  ulMessage.appendChild(liMessage);
});

const form = document.getElementById('messageForm');
const input = document.getElementById('messageInput');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value) {
    const nickname = localStorage.getItem('nickname');
    const chatMessage = input.value;
    socket.emit('message', { chatMessage, nickname });
    input.value = '';
  }
});

const nicknameForm = document.getElementById('nicknameForm');
const nicknameInput = document.getElementById('nicknameInput');

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nickname = nicknameInput.value;
  if (nickname) {
    localStorage.setItem('nickname', nickname);
    document.querySelector(userNicknameTag).textContent = nickname;
    socket.emit('updateNickname', nickname);
    nicknameInput.value = '';
  }
});

socket.on('disconnect', () => {
  socket.emit('removeUser', { id: socket.id });
});
