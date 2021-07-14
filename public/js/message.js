const socket = window.io();
const button = document.querySelector('#saveNickname');
// const sendMessage = document.querySelector('#sendMessage');
const inputNickname = document.querySelector('#nickname');

const form = document.querySelector('form');
const inputMessage = document.querySelector('#messageInput');

const dataTestId = 'data-testid';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const sendMessage = {
    chatMessage: inputMessage.value,
    id: socket.id, // nickname
  };
  console.log('sendMessage', sendMessage);
  socket.emit('message', sendMessage);
  inputMessage.value = '';
  return false;
});

button.addEventListener('click', () => {
  const changeNickname = {
    id: socket.id,
    nickname: inputNickname.value,
  };
  socket.emit('changeUser', changeNickname);
  return false;
});

const createWelcomeMessage = (message) => {
  console.log('message', message);
  const messagesUl = document.querySelector('#welcome-messages');
  const h3 = document.createElement('h3');
  h3.setAttribute(dataTestId, 'message');
  h3.innerText = message;
  messagesUl.appendChild(h3);
};

// cria uma `li` e coloca dentro da `ul` com `id` mensagens
const createMessage = (message) => {
  console.log('message', message);
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.setAttribute(dataTestId, 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

const createUserList = (users) => {
  const messagesUl = document.querySelector('#userList');
  // messagesUl.innerText = '';
  users.map((user) => {
  const nick = user.nickname;
  const li = document.createElement('li');
  li.setAttribute(dataTestId, 'online-user');
  li.setAttribute('id', socket.id);
  li.innerText = nick;
  return messagesUl.appendChild(li);
  });
};

const userListLoad = (userID, user) => {
  console.log('userID', userID);
  console.log('users', user);
  const listLoad = user.filter((us) => us !== userID);
  return createUserList(listLoad);
};

// const removeUserOfList = (userID) => {
//   console.log('removeUserOfList', userID);
//   const userToRemove = document.querySelector(`#${userID}`);
//   userToRemove.parentNode.removeChild(userToRemove);
// };

// Quando nosso evento `ola` for emitido, vamos pegar a string mensagem enviada pelo nosso evento e passar para a função `createMessage`
socket.on('hello', (mensagem) => createWelcomeMessage(mensagem));
socket.on('reply', (mensagem) => createMessage(mensagem));
socket.on('message', (mensagem) => createMessage(mensagem));
socket.on('userList', (users) => createUserList(users));
socket.on('disconnectUser', (userID, user) => userListLoad(userID, user));
// socket.on('disconnectUser', (userID) => removeUserOfList(userID));

window.onbeforeunload = () => {
  socket.disconnect();
};
