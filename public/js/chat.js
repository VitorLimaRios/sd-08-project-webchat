const socket = window.io();

const form = document.querySelector('form');
let nickname;
const addUserButton = document.querySelector('#addNickname');
const nickNameOnline = '#nickNameOnline';
const dataTestid = 'data-testid';

addUserButton.addEventListener('click', () => {
  const actualNickName = document.querySelector(nickNameOnline).innerText;
  console.log('atual', actualNickName);
  nickname = document.querySelector('#nickName').value;
  document.querySelector(nickNameOnline).innerText = nickname;
  localStorage.setItem('nickname', nickname);
  socket.emit('userChangeNickName', { actualNickName, newNickName: nickname });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const chatMessage = document.querySelector('#messageInput').value;
  nickname = document.querySelector(nickNameOnline).innerText;
  console.log(chatMessage, nickname);
  socket.emit('message', { chatMessage, nickname });
  document.querySelector('#messageInput').value = '';
  return false;
});

const newUser = (nickNameTemp) => {
  console.log('Nome de inicio', nickNameTemp);
  const localNick = localStorage.getItem('nickname');
  console.log('--------------Local', localNick);
  document.querySelector(nickNameOnline).innerText = localNick || nickNameTemp;
  // const user = localNick || nickNameTemp;
  // socket.emit('toLeftPanel', user);
  socket.emit('toLeftPanel', localNick || nickNameTemp);
  // if (localNick) {
  //   socket.emit('toLeftPanel', localNick);
  // } else {
  //   socket.emit('toLeftPanel', nickNameTemp);
  // }
};

const usersConnected = (userConnected) => {
  console.log('Conectados', userConnected);
  const localUser = document.querySelector('#nickNameOnline').innerText;
  const usersToRender = userConnected.filter((element) => element !== localUser);
  const ul = document.querySelector('#allUserLoggeds');
  ul.innerHTML = '';
  usersToRender.forEach((element) => {
    const li = document.createElement('li');
    li.setAttribute(dataTestid, 'online-user');
    li.innerText = element;
    ul.appendChild(li);
  });
};

const createMessage = (data) => {
  // console.log('message', data);
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.setAttribute(dataTestid, 'message');
  li.innerText = data;
  messagesUl.appendChild(li);
};

const renderChat = (tramela) => {
  console.log('chatlocal', tramela);
  const messagesUl = document.querySelector('#messages');

  tramela.forEach((element) => {
    const { timestamp, nickname: opsq, message } = element;
    const li = document.createElement('li');
    li.setAttribute(dataTestid, 'message');
    li.innerText = `${timestamp} ${opsq} ${message}`;
    messagesUl.appendChild(li);
  });
};

socket.on('message', (data) => createMessage(data));
socket.on('newUser', (nickNameTemp) => newUser(nickNameTemp));
socket.on('userConnecteds', (userConnected) => usersConnected(userConnected));
socket.on('allchats', (tramela) => renderChat(tramela));
