const buttonMsg = document.querySelector('#button-message');
const nickNamebutton = document.querySelector('#nickname-btn');
const userNicknameInput = document.querySelector('#nickname');
const inputText = document.querySelector('#message-box');

let userNickname = '';

const validName = (length) => {
  let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  return result;
};

userNickname = validName(16);

const socket = window.io('http://localhost:3000/', {
  query: {
    nickname: userNickname,
  },
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#list');
  const li = document.createElement('li');
  li.dataset.testid = 'message';
  li.innerText = message;
  messagesUl.appendChild(li);
};

buttonMsg.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', {
    nickname: userNickname,
    chatMessage: inputText.value,
  });
  userNickname = '';
  inputText.value = '';
  return false;
});

const createUser = (user) => {
  const messagesUl = document.querySelector('#online');
  const li = document.createElement('li');
  li.dataset.testid = 'online-user';
  li.innerText = user;
  messagesUl.appendChild(li);
};

nickNamebutton.addEventListener('click', (e) => {
  e.preventDefault();
  userNickname = userNicknameInput.value;
  socket.emit('replaceUserNickname', userNickname);
  userNicknameInput.value = '';
  return false;
});

createUser(userNickname);

socket.on('message', (message) => createMessage(message));

socket.on('onlineUser', (users) => {
  const onlineList = document.querySelector('#online');
  onlineList.innerHTML = '';
  createUser(userNickname);
  users.forEach((user) => {
    if (user !== userNickname) createUser(user);
  });
});

socket.on('history', (history) => history.forEach((curr) => createMessage(curr)));
