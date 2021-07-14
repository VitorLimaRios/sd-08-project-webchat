const socket = window.io();

const usersList = document.querySelector('#users');
const messagesList = document.querySelector('#messages');
const nicknameInput = document.querySelector('#nickname');
const messageInput = document.querySelector('#messageBox');
const nicknameBtn = document.querySelector('#nicknameBtn');
const sendBtn = document.querySelector('#sendBtn');

const generateNickname = (length) => {
  let result = '';
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
    result += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return result;
};

// webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/

let nicknameGenerate = generateNickname(16);

socket.emit('newUser', nicknameGenerate);

const createMessage = (newMessage) => {
  const li = document.createElement('li');
  li.innerText = newMessage;
  li.setAttribute('data-testid', 'message');
  messagesList.appendChild(li);
};

const userList = (user) => {
  const li = document.createElement('li');
  li.innerText = user;
  li.setAttribute('data-testid', 'online-user');
  usersList.appendChild(li);
};

nicknameBtn.addEventListener('click', () => {
  nicknameGenerate = nicknameInput.value;
  nicknameInput.value = '';
  socket.emit('nickname', nicknameGenerate);
});

sendBtn.addEventListener('click', () => {
  socket.emit('message', {
    nickname: nicknameGenerate,
    chatMessage: messageInput.value,
  });
  nicknameGenerate = '';
  messageInput.value = '';
  return false;
});

userList(nicknameGenerate);

socket.on('message', (newMessage) => {
  createMessage(newMessage);
});

socket.on('messageLoad', (newMessage) => {
  createMessage(newMessage);
});

socket.on('loadUsers', (users) => {
  usersList.innerHTML = '';
  userList(nicknameGenerate);
  users.forEach((user) => {
    if (user !== nicknameGenerate) {
      return userList(user);
    }
  });
});
