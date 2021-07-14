const socket = window.io();

const message = document.querySelector('#message');
const button = document.querySelector('#button');
const nicknameInput = document.querySelector('#nickname');
const buttonNickname = document.querySelector('#buttonNick');
const chat = document.querySelector('#chat');
const user = document.querySelector('#user');
const usersOnline = document.querySelector('#usersOnline');

const setNickName = (data) => { 
  user.innerHTML = data;
};
const refreshChat = (data) => {
  const p = document.createElement('p');
  p.setAttribute('data-testid', 'message');
  p.innerHTML = data;
  chat.appendChild(p);
};

const refreshUsers = (data) => {
  usersOnline.innerHTML = '';
  const realData = data.filter((element) => element.nickname !== user.innerHTML);
  realData.forEach((element) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    li.innerHTML = element.nickname;
    usersOnline.appendChild(li);
  });
};

buttonNickname.addEventListener('click', () => {
  const newNickName = nicknameInput.value;
  user.innerHTML = newNickName;
  socket.emit('updateUserName', newNickName);
  nicknameInput.value = '';
});

button.addEventListener('click', () => {
  const newMessage = message.value;
  const newNickName = user.innerHTML;
  socket.emit('message', { chatMessage: newMessage, nickname: newNickName });
  message.value = '';
});

socket.on('nickname', setNickName);
socket.on('message', refreshChat);
socket.on('usersOnline', refreshUsers);

window.onbeforeunload = (_event) => {
  socket.disconnect();
};
