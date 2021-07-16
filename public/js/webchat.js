const socket = window.io();
let nickname = null;

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
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
// TODO por que esse li dá erro e o outro não?
const updateUser = (oldNick, newNick) => {
  console.log(oldNick);
  document.querySelectorAll('li').forEach((li) => {
    if (li.textContent.includes(oldNick)) {
      li.innerText = newNick;
    }
  });
  console.log(newNick);
};

const deleteUser = (oldNick) => {
  console.log(oldNick);
  document.querySelectorAll('li').forEach((li) => {
    if (li.textContent.includes(oldNick)) {
      li.remove();
    }
  });
};

const saveBtn = document.querySelector('#nickname-btn');
const inputNickname = document.querySelector('#nickname-text');
saveBtn.addEventListener('click', (e) => {
  e.preventDefault();
  updateUser(nickname, inputNickname.value);
  socket.emit('changeNickname', { nickOld: nickname, nickNew: inputNickname.value });
  nickname = inputNickname.value;
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  console.log('entrou no createmsg');
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

createUser(`${nickname}`);

socket.on('connection', (usersArray) => {
  usersArray.forEach((newUser) => {
    createUser(newUser.nickname);
  });
});
socket.on('message', (message) => createMessage(message));
socket.emit('serverMessage', nickname);
socket.on('serverMessage', (nick) => createUser(nick));
socket.on('changeNickname', (nick) => updateUser(nick.nickOld, nick.nickNew));
socket.on('deleteNickname', (nick) => deleteUser(nick));

// window.onbeforeunload = () => {
//   socket.disconnect();
// };
