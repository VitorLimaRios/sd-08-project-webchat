const socket = window.io();

const chat = document.querySelector('#chat');
const message = document.querySelector('#message');
const button = document.querySelector('#button');
const nicknameInput = document.querySelector('#nickname');
const buttonNickname = document.querySelector('#buttonNick');
const users = document.querySelector('#users');

const DATA_TEST = 'data-testid';
const ONLINE = 'online-user';

const renderUsers = (user) => {
  users.innerHTML = '';
  console.log(user);
  let li = document.createElement('li');
  li = document.createElement('li');
  li.innerText = user;
  li.setAttribute(DATA_TEST, ONLINE);
  users.appendChild(li);
};

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  sessionStorage.setItem('nickname', result);
  // renderUsers(result);
  return socket.emit('user', result);
} // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

// const userList = [];

// const addUser = (username, sockets) => {
//   const newUser = { username, sockets };
//   console.log(newUser);
//   userList.push(newUser);
//   socket.emit('user', userList);
// };

// const updateNick = () => {
//   const randomNick = makeid(16);
//   sessionStorage.setItem('nickname', randomNick);
//   users.innerHTML = randomNick;
//   socket.on('user', () => {
//     socket.emit('user', randomNick);
//   });
// };
// updateNick();
makeid(16);

// nicknameOnline.innerHTML = makeid(16);
// const randomNick = makeid(16);
// sessionStorage.setItem('nickname', randomNick);
// const newUser = { nickname: randomNick, socket };
// userList.push(newUser);

// const changeNick = (newNickname) => {
//   console.log(newNickname);
//   socket.emit('changeNick', { newNickname, socket });
// };

buttonNickname.addEventListener('click', () => {
  sessionStorage.setItem('nickname', nicknameInput.value);  
  const newNickname = sessionStorage.getItem('nickname');
  const changeUser = { user: newNickname, socketId: socket.id };
  console.log(changeUser);
  socket.emit('changeNickName', changeUser);
  nicknameInput.value = '';
});

button.addEventListener('click', () => {
  const nickname = sessionStorage.getItem('nickname');
  const chatMessage = message.value;
  socket.emit('message', { chatMessage, nickname });
  message.value = '';
});

const renderMessage = (msg) => {
  const li = document.createElement('li');
  li.setAttribute(DATA_TEST, 'message');
  li.innerText = msg;
  chat.appendChild(li);
};

// const renderUsers = (user) => {
//   users.innerHTML = '';
//   console.log(user);
//   let li = document.createElement('li');
//   li = document.createElement('li');
//   li.innerText = user;
//   li.setAttribute(DATA_TEST, ONLINE);
//   users.appendChild(li);
// };

const renderAllUsers = (user) => {
  users.innerHTML = '';
  console.log(socket.id);
  const socketUser = user.find((currentUser) => currentUser.socketId === socket.id);
  console.log(socketUser);
  const otherUsers = user.filter((currentUser) => currentUser.socketId !== socket.id);
  console.log(otherUsers);
  let li = document.createElement('li');
  [socketUser, ...otherUsers].forEach((elem) => {
    li = document.createElement('li');
    console.log(elem);
    li.innerText = elem.user;
    li.setAttribute(DATA_TEST, ONLINE);
    users.appendChild(li);
  });
};

socket.on('message', (msg) => {
  renderMessage(msg);
});

socket.on('changeNickName', (data) => {
  renderAllUsers(data);
});

socket.on('allUsers', (data) => {
  renderAllUsers(data);
});

socket.on('user', (msg) => {  
  renderUsers(msg);
});

socket.on('start', (allMessages) => {
  allMessages.forEach((elem) => {
    renderMessage(elem);
  });
});
