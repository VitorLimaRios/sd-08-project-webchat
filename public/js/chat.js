const socket = window.io();

const TESTID = 'data-testid';

socket.emit('userConnected');

const sendButton = document.querySelector('#send-button-id');
sendButton.addEventListener('click', () => {
  const nickname = localStorage.getItem(socket.id);
  const messageBox = document.querySelector('#message-box-id');
  socket.emit('message', { chatMessage: messageBox.value, nickname });
  messageBox.value = '';
});

const saveNicknameButton = document.querySelector('#nickname-button');
saveNicknameButton.addEventListener('click', () => {
  const nicknameInput = document.querySelector('#nickname-input');
  socket.emit('changeNickname', nicknameInput.value);
  localStorage.setItem(socket.id, nicknameInput.value);
  nicknameInput.value = '';
});

const createOnlineUsers = (onlineUsers) => {
  const onlineUsersList = document.getElementById('users-list');
  while (onlineUsersList.firstChild) {
    onlineUsersList.removeChild(onlineUsersList.firstChild);
  }
  const onlineUsersNicknames = Object.values(onlineUsers);
  onlineUsersNicknames.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user;
    li.setAttribute(TESTID, 'online-user');
    onlineUsersList.appendChild(li);
  });
};

const createMessage = (message) => {
  const messagesList = document.querySelector('#messages-list');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute(TESTID, 'message');
  messagesList.appendChild(li);
};

const showMessageHistory = (messageHistory) => {
  const messagesList = document.querySelector('#messages-list');
  messageHistory.forEach((message) => {
    const { timestamp, nickname, message: content } = message;
    const li = document.createElement('li');
    li.innerText = `${timestamp} - ${nickname}: ${content}`;
    li.setAttribute(TESTID, 'message');
    messagesList.appendChild(li);
  });
};

socket.on('onlineUsers', (onlineUsers) => createOnlineUsers(onlineUsers));
socket.on('saveStorage', ({ socketId, nickname }) => localStorage.setItem(socketId, nickname));
socket.on('message', (message) => createMessage(message));
socket.on('history', (messageHistory) => showMessageHistory(messageHistory));