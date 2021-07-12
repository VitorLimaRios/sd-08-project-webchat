const socket = window.io();
const nicknameInput = document.getElementById('nickname-input');
const messagesList = document.getElementById('messages');

let nickName = '';

socket.on('welcome', (message) => console.log(message));
socket.on('defaultNickname', (defaultNick) => {
  nickName = defaultNick;
  nicknameInput.value = nickName;
});

const createMessageLi = (message) => {
  const li = document.createElement('li');
  li.className = 'message-li';
  li.innerHTML = message;
  return li;
};

socket.on('message', (message) => {
  messagesList.appendChild(createMessageLi(message));
});

const changeNicknameBtn = document.getElementById('save-nickname-btn');
const updateNickname = (event) => {
  event.preventDefault();
  nickName = nicknameInput.value;
  socket.emit('updateNickname', nickName);
};
changeNicknameBtn.addEventListener('click', updateNickname);

const sendMessage = (event) => {
  event.preventDefault();
  const chatMessage = document.getElementById('message-input').value;
  socket.emit('message', { chatMessage, nickName });
};

const sendMessageBtn = document.getElementById('send-message');
sendMessageBtn.addEventListener('click', sendMessage);
