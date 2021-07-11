const socket = window.io();

const nicknameForm = document.getElementById('nickname-form');
const nicknameInput = document.getElementById('nickname-input');
const messagesContainer = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const usersOnlineContainer = document.getElementById('users');

let nickname = null;

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const chatMessage = messageInput.value;
  socket.emit('message', { chatMessage, nickname });
  messageInput.value = '';
});

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newNickname = nicknameInput.value;
  nickname = newNickname;
  socket.emit('updateNickname', nickname);
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
  usersOnlineContainer.insertBefore(newUser, newUser.nextElementSibling);
};

socket.on('message', (message) => createMessageOnPage(message));
socket.on('setAllSavedMessages', (allMessages) => {
  allMessages.forEach((message) => createMessageOnPage(message));
});
socket.on('login', (newUser) => { 
  nickname = newUser;
  createUserOnPage(nickname);
});
socket.on('setAllOnlineUsers', (usersOnline) => {
  usersOnlineContainer.innerHTML = '';
  createUserOnPage(nickname);
  usersOnline.forEach((user) => {
    if (user !== nickname) {
      createUserOnPage(user);
    }
  });
});
