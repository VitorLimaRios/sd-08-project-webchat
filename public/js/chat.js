const socket = window.io();
const nicknameInput = document.getElementById('nickname-input');
const messagesList = document.getElementById('messages');
const nicknamesList = document.querySelector('.users-list');

const mySocket = { id: '' };
const nicknames = {};

socket.on('socketId', (id) => {
  mySocket.id = id;
});

const createUserNicknameLi = (username) => {
  const li = document.createElement('li');
  li.className = 'nickname-li';
  li.innerHTML = username;
  li.setAttribute('data-testid', 'online-user');
  return li;
};
const updateNicksOnScreen = () => {
  nicknamesList.innerHTML = '';
const { [mySocket.id]: myNick, ...otherNicks } = nicknames;
const myNickOnScreen = document.querySelector('.my-nickname');
myNickOnScreen.innerHTML = myNick;
Object.values(otherNicks).forEach((nick) => {
nicknamesList.appendChild(createUserNicknameLi(nick));
});
};

socket.on('allNicknames', (allNicks) => {
  const socketIds = Object.keys(allNicks);
  socketIds.forEach((socketId) => {
    nicknames[socketId] = allNicks[socketId];
  });
  console.log(nicknames);
  updateNicksOnScreen();
});

socket.on('updateNickname', ({ userId, newNick }) => {
  nicknames[userId] = newNick;
  console.log('UPDATED_NICKNAMES', nicknames);
  updateNicksOnScreen();
});

const createMessageLi = (message) => {
  const li = document.createElement('li');
  li.className = 'message-li';
  li.innerHTML = message;
  li.setAttribute('data-testid', 'message');
  return li;
};

socket.on('message', (message) => {
  messagesList.appendChild(createMessageLi(message));
});

socket.on('removeUser', (socketId) => { 
  delete nicknames[socketId];
  updateNicksOnScreen();
});

const changeNicknameBtn = document.getElementById('save-nickname-btn');
const updateNickname = (event) => {
  event.preventDefault();
  const newNickname = nicknameInput.value;
  socket.emit('changeNickname', newNickname);
};
changeNicknameBtn.addEventListener('click', updateNickname);

const sendMessage = (event) => {
  const myNickname = nicknames[mySocket.id];
  event.preventDefault();
  const chatMessage = document.getElementById('message-input').value;
  socket.emit('message', { chatMessage, nickname: myNickname });
};

const sendMessageBtn = document.getElementById('send-message');
sendMessageBtn.addEventListener('click', sendMessage);
