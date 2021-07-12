const socket = window.io();

const nicknameInput = document.getElementById('nicknameInput');
const btnSalvar = document.getElementById('btn-salvar');
const btnEnviar = document.getElementById('btn-enviar');
const messageArea = document.getElementById('message-area');
const chat = document.getElementById('chat');
// const users = document.getElementById('users');
// let userQuantity = 1;

btnSalvar.addEventListener('click', () => {
  localStorage.setItem('nickname', nicknameInput.value);
  return false;
});

btnEnviar.addEventListener('click', () => {
  let nickname = localStorage.getItem('nickname');
  const chatMessage = messageArea.value;
  if (!nickname) nickname = 'anônimo';
  socket.emit('message', { chatMessage, nickname });
  return false;
});

socket.on('message', (message) => {
  chat.value += message;
});

socket.on('serverMessage', (message) => {
  chat.value += message;
});

// socket.on('connection', () => {
//   users.value += `Usuário${userQuantity}`;
//   userQuantity += 1;
// });

// socket.on('getUsers', (othersUsers) => {
//   users.value += '';
// });

// window.onload = () => {
//   const user = localStorage.getItem('nickname');
//   if (!user) localStorage.setItem('nickname', 'random-name00001');
//   const user = `Usuário${userQuantity}`;
//   users.value += user;
//   userQuantity += 1;
//   socket.emit('userConnect', user);
// };

window.onbeforeunload = () => socket.disconnect();
