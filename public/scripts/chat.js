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
  const localUsers = JSON.parse(localStorage.getItem('users'));
  localUsers[0] = nicknameInput.value;
  localStorage.setItem('users', JSON.stringify(localUsers));
  usersList.firstChild.textContent = nicknameInput.value;
  socket.emit('updateUsers', changeUser);
  return false;
});

btnEnviar.addEventListener('click', (e) => {
  e.preventDefault();
  const [nickname] = JSON.parse(localStorage.getItem('users'));
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

const mainUserName = () => {
  const socketId = socket.id;
  const localUsers = localStorage.getItem('users');
  const users = JSON.parse(localUsers);
  const randomUserName = `Usuario${socketId.substring(0, 9)}`;
  if (!users) {
    localStorage.setItem('users', JSON.stringify([randomUserName]));
  } else {
    localStorage.setItem('users', JSON.stringify([randomUserName, ...users]));
  }
  createUser(randomUserName, 'mainUser');
  socket.emit('userConnect', randomUserName);
  return false;
};

const getAllUsers = () => {
  const mainUser = usersList.firstChild.textContent;
  const localUsers = localStorage.getItem('users');
  const users = JSON.parse(localUsers);
  const index = users.indexOf(mainUser);
  users.splice(index, 1);
  users.map((user) => createUser(user, 'otherUser'));
  return false;
};

const refreshUsers = () => {
  const mainUser = usersList.firstChild.textContent;
  usersList.innerText = '';
  createUser(mainUser, 'mainUser');
  getAllUsers();
};

// btnEnviar.addEventListener('click', (e) => {
//   e.preventDefault();
//   const message = messageArea.value;
//   const nickname = usersList.firstChild.textContent;
//   // const url = 'http://localhost:3000/';

//   // const body = { message, nickname };

//   // const request = new XMLHttpRequest();
//   // request.open('POST', url, true);
//   // request.setRequestHeader('Content-type', 'application/json');
//   // request.send(JSON.stringify(body));

//   // fetch('http://localhost:3000/', {
//   //   method: 'post',
//   //   body: JSON.stringify(body),
//   // }).then((response) => console.log(response))
//   // .catch((err) => console.log(err));
//   return false;
// });

socket.on('message', (message) => {
  createMessage(message);
});

socket.on('userConnect', (userName) => {
  createUser(userName, 'otherUser');
  // getAllUsers();
});

socket.on('updateUsers', (_users) => {
  refreshUsers();
});

socket.on('connection', () => {
  mainUserName();
  getAllUsers();
  // const localUsers = JSON.parse(localStorage.getItem('users'));
  // socket.emit('users', localUsers);
  // socket.on('users', (users) => {

  // });
});

socket.on('oldMessages', (messages) => {
  messages.map(({ message, nickname, timestamp }) => {
    const structureMessage = `${timestamp} - ${nickname}: ${message}`;
    createMessage(structureMessage);
    return false;
  });
});

window.onbeforeunload = () => {
  const mainUser = usersList.firstChild.textContent;
  const localUsers = localStorage.getItem('users');
  const users = JSON.parse(localUsers);
  const index = users.indexOf(mainUser);
  users.splice(index, 1);
  localStorage.setItem('users', JSON.stringify(users));
  // socket.emit('updateUsers');
  socket.disconnect();
};
