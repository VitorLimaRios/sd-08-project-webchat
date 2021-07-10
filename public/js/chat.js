const socket = window.io();

const form = document.querySelector('form');
let nickname;
const addUserButton = document.querySelector('#addNickname');
const nickNameOnline = '#nickNameOnline';

addUserButton.addEventListener('click', () => {
  const actualNickName = document.querySelector(nickNameOnline).innerText;
  console.log('atual', actualNickName);
  nickname = document.querySelector('#nickName').value;
  document.querySelector(nickNameOnline).innerText = nickname;
  socket.emit('userChangeNickName', { actualNickName, newNickName: nickname });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const chatMessage = document.querySelector('#messageInput').value;
  socket.emit('message', { chatMessage, nickname });
  document.querySelector('#messageInput').value = '';
  return false;
});

const newUser = (nickNameTemp) => {
  // console.log(nickNameTemp);
  document.querySelector(nickNameOnline).innerText = nickNameTemp;
  socket.emit('toLeftPanel', nickNameTemp);
};

// const ops = [];

const usersConnected = (userConnected) => {
  console.log('ops', userConnected);
  const localUser = document.querySelector('#nickNameOnline').innerText;
  const usersToRender = userConnected.filter((element) => element !== localUser);
  const ul = document.querySelector('#allUserLoggeds');
  ul.innerHTML = '';
  usersToRender.forEach((element) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    li.innerText = element;
    ul.appendChild(li);
  });
};

const createMessage = (data) => {
  // console.log('message', data);
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = data;
  messagesUl.appendChild(li);
};

socket.on('message', (data) => createMessage(data));
socket.on('newUser', (nickNameTemp) => newUser(nickNameTemp));
socket.on('userConnecteds', (userConnected) => usersConnected(userConnected));
