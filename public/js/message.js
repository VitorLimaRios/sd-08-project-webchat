const socket = window.io();
const button = document.querySelector('#pingButton');
// const sendMessage = document.querySelector('#sendMessage');

const form = document.querySelector('form');
const inputMessage = document.querySelector('#messageInput');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const sendMessage = {
    chatMessage: inputMessage.value,
    nickname: 'Leticia',
  };
  socket.emit('message', sendMessage);
  // inputMessage.value = '';
  return false;
});

button.addEventListener('click', (e) => {
  socket.emit('goin');
  return false;
});

// cria uma `li` e coloca dentro da `ul` com `id` mensagens
const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  messagesUl.appendChild(li);
};

// Quando nosso evento `ola` for emitido, vamos pegar a string mensagem enviada pelo nosso evento e passar para a função `createMessage`
socket.on('hello', (mensagem) => createMessage(mensagem));
socket.on('reply', (mensagem) => createMessage(mensagem));
socket.on('writeMessage', (mensagem) => createMessage(mensagem));
