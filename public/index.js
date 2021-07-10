const socket = window.io();

const chat = document.querySelector('#chat');
const message = document.querySelector('#message');
const button = document.querySelector('#button');
const nicknameInput = document.querySelector('#nickname');
const nickname = document.querySelector('#username');
const buttonNickname = document.querySelector('#buttonNick');

function randomNameGenerator(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
} // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

window.onload = () => {
  nickname.innerHTML = randomNameGenerator(16);
};

buttonNickname.addEventListener('click', () => {
  const newNickName = nicknameInput.value;
  nickname.innerHTML = newNickName;
  socket.emit('nickname', newNickName);
});

button.addEventListener('click', () => {
  const newMessage = message.value;
  const newNickName = nickname.innerHTML;
  socket.emit('message', { chatMessage: newMessage, nickname: newNickName });
});

socket.on('message', (messageChat) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = messageChat;
  chat.appendChild(li);
});
