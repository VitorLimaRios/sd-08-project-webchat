const socket = window.io();
let nickname = null;

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

nickname = makeid(16);

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
  li.id = 'users';
  li.setAttribute('data-testid', 'online-user');
  li.innerText = user;
  users.appendChild(li);
};

createUser(nickname);

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
