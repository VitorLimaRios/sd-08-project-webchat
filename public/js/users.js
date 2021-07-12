const socket = window.io();

const userNicknameTag = '#userNickname';

socket.on('yourNickname', (nickname) => {
  const userNickname = document.querySelector(userNicknameTag);
  userNickname.textContent = nickname;

  localStorage.setItem('nickname', nickname);

  socket.emit('getUsers', nickname);
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
  if (nicknameInput.value) {
    localStorage.setItem('nickname', nicknameInput.value);
    document.querySelector(userNicknameTag).textContent = nicknameInput.value;
    nicknameInput.value = '';
  }
});

socket.on('disconnect', () => {
  socket.emit('removeUser', { id: socket.id });
});
