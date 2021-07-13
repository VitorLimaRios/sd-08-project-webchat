const socket = window.io();

const chat = document.querySelector('#chat');
const message = document.querySelector('#message');
const button = document.querySelector('#button');
const nicknameInput = document.querySelector('#nickname');
const buttonNickname = document.querySelector('#buttonNick');
const userList = document.querySelector('#usersOn');

function randomNameGenerator(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
} // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const userNameRandom = document.createElement('li');
userNameRandom.innerText = randomNameGenerator(16);
userList.appendChild(userNameRandom);
socket.emit('newUser', userNameRandom.innerHTML);

buttonNickname.addEventListener('click', () => {
  const newNickName = nicknameInput.value;
  userNameRandom.innerHTML = newNickName;
  socket.emit('newUser', newNickName);
});

button.addEventListener('click', () => {
  const newMessage = message.value;
  const newNickName = userNameRandom.innerHTML;
  socket.emit('message', { chatMessage: newMessage, nickname: newNickName });
  message.value = '';
});

const datatestid = 'data-testid';

socket.on('message', (messageChat) => {
  const li = document.createElement('li');
  li.setAttribute(datatestid, 'message');
  li.innerText = messageChat;
  chat.appendChild(li);
});

socket.on('userConnected', (data) => {
  data.forEach((element) => {
    const li = document.createElement('li');
    li.setAttribute(datatestid, 'message');
    li.innerText = element;
    chat.appendChild(li);
  });
});

socket.on('updateNickName', (data) => {
  userList.innerHTML = '';
  data.map((element) => element.nickname).forEach((value) => {
    const li = document.createElement('li');
    li.setAttribute(datatestid, 'online-user');
    li.innerText = value;
    userList.appendChild(li);
  });
});
