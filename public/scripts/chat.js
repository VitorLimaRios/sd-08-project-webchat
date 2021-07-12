const socket = window.io();

const nicknameInput = document.getElementById('nicknameInput');
const btnSalvar = document.getElementById('btn-salvar');
const btnEnviar = document.getElementById('btn-enviar');
const messageArea = document.getElementById('message-area');
const chat = document.getElementById('chat');

const createMessage = (message) => {
  const chatBox = document.getElementById('chat');
  const li = document.createElement('li');
  li.id = 'message';
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  chatBox.appendChild(li);
};

btnSalvar.addEventListener('click', () => {
  localStorage.setItem('nickname', nicknameInput.value);
  const userList = document.getElementById('usersConnected');
  userList.firstChild.textContent = nicknameInput.value;
  return false;
});

btnEnviar.addEventListener('click', () => {
  const nickname = localStorage.getItem('nickname');
  const chatMessage = messageArea.value;
  socket.emit('message', { chatMessage, nickname });
  return false;
});

const createUser = (name, id = '', test = '') => {
  const usersList = document.getElementById('usersConnected');
  const li = document.createElement('li');
  li.id = id;
  li.setAttribute('data-testid', test);
  li.innerText = name;
  usersList.appendChild(li);
};

const mainUserName = () => {
  const socketId = socket.id;
  const randomUserName = `Usuário-${socketId.substring(0, 8)}`;
  localStorage.setItem('nickname', randomUserName);
  createUser(randomUserName, 'mainUser', 'online-user');
  socket.emit('userConnect', randomUserName);
  return false;
};

socket.on('message', (message) => {
  createMessage(message);
});

socket.on('serverMessage', (message) => {
  chat.value += message;
});

socket.on('userConnect', (userName) => {
  createUser(userName, 'otherUser');
});

socket.on('connection', () => {
  mainUserName();
});

window.onbeforeunload = () => socket.disconnect();
