const socket = window.io();

const form = document.querySelector('form');
const inputNickName = document.querySelector('#nickName');
const inputTexto = document.querySelector('#messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nickName = document.querySelectorAll('#onlineUser')[0].textContent;
  socket.emit('message', {
    nickname: nickName,
    chatMessage: inputTexto.value,
  });
  inputTexto.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messageAdd');
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.innerText = message;
  li.dataset.testid = 'message';
  messagesUl.appendChild(li);
};

socket.on('message', (msg) => createMessage(msg));

const createUser = (message) => {
  const messagesUl = document.querySelector('#online');
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.id = 'onlineUser';
  li.innerText = message;
  li.dataset.testid = 'online-user';
  messagesUl.appendChild(li);
};

socket.on('newConnection', ({ message }) => createUser(message));

const nickNameButton = document.querySelector('#saveNickName');

const editUser = (nickname) => {
  const user = document.querySelectorAll('#onlineUser')[0];
  user.innerText = nickname;
};

socket.on('saveNickName', (nickname) => editUser(nickname));

nickNameButton.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('saveNickName', {
    nickname: inputNickName.value,
  });
  inputNickName.value = '';
  return false;
});
