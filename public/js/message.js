const socket = window.io();
const button = document.querySelector('#saveNickname');
// const sendMessage = document.querySelector('#sendMessage');

const form = document.querySelector('form');
const inputMessage = document.querySelector('#messageInput');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const sendMessage = {
    chatMessage: inputMessage.value,
    nickname: socket.id,
  };
  socket.emit('message', sendMessage);
  socket.emit('userConect', sendMessage.nickname);
  inputMessage.value = '';
  return false;
});

button.addEventListener('click', () => {
  socket.emit('goin');
  return false;
});

// cria uma `li` e coloca dentro da `ul` com `id` mensagens
const createMessage = (message) => {
  console.log('message', message);
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  // li.dataset.testid = "message";
  messagesUl.appendChild(li);
};

const createUserList = (users) => {
  console.log('users', typeof users);
  users.map((user) => {
    const messagesUl = document.querySelector('#userList');
    const li = document.createElement('li');
    li.innerText = user;
    return messagesUl.appendChild(li);
  });
};

// Quando nosso evento `ola` for emitido, vamos pegar a string mensagem enviada pelo nosso evento e passar para a função `createMessage`
socket.on('hello', (mensagem) => createMessage(mensagem));
socket.on('reply', (mensagem) => createMessage(mensagem));
socket.on('message', (mensagem) => createMessage(mensagem));
socket.on('userList', (users) => createUserList(users));
