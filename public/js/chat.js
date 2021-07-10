const socket = window.io();

const form = document.querySelector('form');
let nickname;
const addUserButton = document.querySelector('#addNickname');

addUserButton.addEventListener('click', () => {
  nickname = document.querySelector('#nickName').value;
  document.querySelector('#nickNameOnline').innerText = nickname;
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
  document.querySelector('#nickNameOnline').innerText = nickNameTemp;
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
