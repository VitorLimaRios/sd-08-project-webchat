const socket = window.io();

socket.on('userConection', () => {
  const ulUser = document.querySelector('#usersList');

  const liUser = document.createElement('li');
  liUser.textContent = socket.id;

  ulUser.appendChild(liUser);

  localStorage.setItem('nickname', socket.id);
});

socket.on('message', (message) => {
  const ulMessage = document.querySelector('#messagesList');

  const liMessage = document.createElement('li');
  liMessage.textContent = message;

  ulMessage.appendChild(liMessage);
});

const form = document.getElementById('messageForm');
const input = document.getElementById('messageInput');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    const nickname = localStorage.getItem('nickname')
      ? localStorage.getItem('nickname') : socket.id;
    const chatMessage = input.value;
    socket.emit('message', { chatMessage, nickname });
    input.value = '';
  }
});

const nicknameForm = document.getElementById('userNickname');
const nicknameInput = document.getElementById('nickname');

nicknameForm.addEventListener('click', (e) => {
  e.preventDefault();
  if (nicknameInput.value) {
    localStorage.setItem('nickname', nicknameInput.value);

    nicknameInput.value = '';
  }
});
