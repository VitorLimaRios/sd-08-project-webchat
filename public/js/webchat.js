const socket = window.io();
let nickname = null;

const form = document.querySelector('#form-msg');
const inputMessage = document.querySelector('#message-input');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('entrou');
  socket.emit('message', { chatMessage: inputMessage.value, nickname });
  inputMessage.value = '';
  return false;
});

const saveBtn = document.querySelector('#nickname-btn');
const inputNickname = document.querySelector('#nickname-text');
saveBtn.addEventListener('click', (e) => {
  e.preventDefault();
  nickname = inputNickname.value;
  socket.emit('changeNickname', nickname);
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.id = 'message';
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

const createUser = (user) => {
  const users = document.querySelector('#users');
  const li = document.createElement('li');
  li.textContent = user;
  li.dataset.testid = 'online-user';
  users.appendChild(li);
};

socket.on('message', (message) => createMessage(message));

socket.on('init', (data) => {
  nickname = data.nickname;
  data.historyMsgs.forEach((message) => {
    createMessage(message);
  });
});

// socket.on('updateUsers', (updatedList) => {
//   const users = document.querySelector('#users');
//   [...users.children].forEach((elem) => elem.remove());
//   createUser(nickname);
//   updatedList.forEach((user) => {
//     if (user !== nickname) createUser(user);
//   });
// });

window.onbeforeunload = () => {
  socket.disconnect();
};
