const socket = window.io();

const nicknameInput = document.getElementById('nicknameInput');
const btnSalvar = document.getElementById('btn-salvar');
const btnEnviar = document.getElementById('btn-enviar');
const messageArea = document.getElementById('message-area');
const chat = document.getElementById('chat');

btnSalvar.addEventListener('click', () => {
  localStorage.setItem('nickname', nicknameInput.value);
});

btnEnviar.addEventListener('click', () => {
  let nickname = localStorage.getItem('nickname');
  const chatMessage = messageArea.value;
  if (!nickname) nickname = 'anônimo';
  socket.emit('message', { nickname, chatMessage });
});

socket.on('postMessage', (message) => {
  console.log(message);
  chat.value += message;
});
