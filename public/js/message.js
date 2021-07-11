const socket = window.io();

const nicknameContainer = document.getElementById('nickname');
const nicknameForm = document.getElementById('nickname-form');
const nicknameInput = document.getElementById('nickname-input');
const messagesContainer = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const usersOnlineContainer = document.getElementById('users');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const chatMessage = messageInput.value;
  const nickname = nicknameContainer.innerText;
  socket.emit('message', { chatMessage, nickname });
  messageInput.value = '';
});

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newNickname = nicknameInput.value;
  nicknameContainer.innerText = newNickname;
  socket.emit('updateNickname', newNickname);
  nicknameInput.value = '';
});

const createMessageOnPage = (message) => {
  const newMessage = document.createElement('li');
  newMessage.setAttribute('data-testid', 'message');
  newMessage.innerText = message;
  messagesContainer.appendChild(newMessage);
};

const createUserOnPage = (user) => {
  const newUser = document.createElement('li');
  newUser.setAttribute('data-testid', 'online-user');
  newUser.innerText = user;
  usersOnlineContainer.insertBefore(newUser, usersOnlineContainer.firstChild);
};

socket.on('message', (message) => createMessageOnPage(message));
socket.on('setAllSavedMessages', (allMessages) => {
  allMessages.forEach((message) => createMessageOnPage(message));
});
socket.on('login', (nickname) => { nicknameContainer.innerText = nickname; });
socket.on('setAllOnlineUsers', (usersOnline) => {
  usersOnlineContainer.innerHTML = '';
  usersOnline.forEach((user) => {
    if (user !== nicknameContainer.innerText) {
      createUserOnPage(user);
    }
  });
});
