const socket = window.io();

const nicknameContainer = document.getElementById('nickname');
const nicknameForm = document.getElementById('nickname-form');
const nicknameInput = document.getElementById('nickname-input');
const messagesContainer = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

const randomNicknameGenerator = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const upperLetters = letters.toUpperCase();
  const numbers = '0123456789_';
  const allChars = letters + upperLetters + numbers;
  let randomNick = '';
  for (let i = 0; i < 16; i += 1) {
    randomNick += allChars[Math.floor(Math.random() * allChars.length)];
  }
  return randomNick;
};

nicknameContainer.innerText = randomNicknameGenerator();

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
  nicknameInput.value = '';
});

const createMessageOnPage = (message) => {
  const newMessage = document.createElement('li');
  newMessage.setAttribute('data-testid', 'message');
  newMessage.innerText = message;
  messagesContainer.appendChild(newMessage);
};

socket.on('message', (message) => createMessageOnPage(message));
