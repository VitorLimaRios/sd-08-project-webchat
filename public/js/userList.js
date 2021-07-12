const socket = window.io();
// const button = document.querySelector('#saveNickname');

// const form = document.querySelector('form');
// const inputUser = document.querySelector('#nickname');

// form.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const sendMessage = {
//     chatMessage: inputMessage.value,
//     nickname: 'Leticia',
//   };
//   socket.emit('message', sendMessage);
//   // inputMessage.value = '';
//   return false;
// });

// button.addEventListener('click', () => {
//   const newUser = inputUser.value;
//   console.log('newUser', newUser);
//   socket.emit('newUser', newUser);
//   return false;
// });

// cria uma `li` e coloca dentro da `ul` com `id` mensagens
const createUserList = (users) => {
  const messagesUl = document.querySelector('#userList');
  const li = document.createElement('li');
  li.innerText = users;
  messagesUl.appendChild(li);
};

// Quando nosso evento `ola` for emitido, vamos pegar a string mensagem enviada pelo nosso evento e passar para a função `createMessage`
// socket.on('hello', (mensagem) => createMessage(mensagem));
// socket.on('reply', (mensagem) => createMessage(mensagem));
// socket.on('writeMessage', (mensagem) => createMessage(mensagem));
socket.on('userList', (users) => createUserList(users));