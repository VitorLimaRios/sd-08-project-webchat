const socket = window.io();

const nicknameInput = document.getElementById('nicknameInput');
const btnSalvar = document.getElementById('btn-salvar');
const btnEnviar = document.getElementById('btn-enviar');
const messageArea = document.getElementById('message-area');
const usersList = document.getElementById('usersConnected');
const chatBox = document.getElementById('chat');

const createMessage = (message) => {
  const li = document.createElement('li');
  li.id = 'message';
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  chatBox.appendChild(li);
};

btnSalvar.addEventListener('click', () => {
  const changeUser = { oldUser: usersList.firstChild.textContent, newUser: nicknameInput.value };
  usersList.firstChild.textContent = nicknameInput.value;
  socket.emit('updateUsers', changeUser);
  return false;
});

btnEnviar.addEventListener('click', (e) => {
  e.preventDefault();
  const nickname = usersList.firstChild.textContent;
  const chatMessage = messageArea.value;
  socket.emit('message', { chatMessage, nickname });
  return false;
});

const createUser = (name, id = '') => {
  const li = document.createElement('li');
  li.id = id;
  li.setAttribute('data-testid', 'online-user');
  li.innerText = name;
  usersList.appendChild(li);
};

const getConnectedUsers = (users) => {
  const mainUser = usersList.firstChild.textContent;
  const user = users.find(({ userName }) => userName === mainUser);
  const index = users.indexOf(user);
  users.splice(index, 1);
  users.map(({ userName }) => createUser(userName, 'otherUser'));
  return false;
};

const userConnect = () => {
  const socketId = socket.id;
  const randomUserName = `Usuario${socketId.substring(0, 9)}`;
  createUser(randomUserName, 'mainUser');
  socket.emit('userConnect', randomUserName);
};

const refreshUsers = (users) => {
  const mainUser = usersList.firstChild.textContent;
  usersList.innerText = '';
  createUser(mainUser, 'mainUser');
  getConnectedUsers(users);
};

socket.on('message', (message) => {
  createMessage(message);
});

socket.on('userConnect', (userName) => {
  createUser(userName, 'otherUser');
});

socket.on('updateUsers', (users) => {
  refreshUsers(users);
});

socket.on('otherUsers', (users) => {
  getConnectedUsers(users);
});

socket.on('connection', () => {
  userConnect();
});

socket.on('oldMessages', (messages) => {
  messages.map(({ message, nickname, timestamp }) => {
    const structureMessage = `${timestamp} - ${nickname}: ${message}`;
    createMessage(structureMessage);
    return false;
  });
});

socket.on('disconnectUser', (userstest) => {
  console.log(userstest);
  refreshUsers(userstest);
});
