const socket = window.io();

const messageForm = document.querySelector('#messagesForm');
const nicknameForm = document.querySelector('#nicknameForm');

const createMessagesList = (message) => {
  const messagesList = document.querySelector('#messagesList');
  const singleMessage = document.createElement('li');

  singleMessage.setAttribute('data-testid', 'message');
  singleMessage.setAttribute('class', 'msg');
  singleMessage.innerText = message;
  messagesList.appendChild(singleMessage);
};

const createUsersList = (user) => {
  const usersList = document.querySelector('#usersList');
  usersList.innerHTML = '';
  const usersName = document.querySelectorAll('#onlineUser');
  if (usersName) usersName.forEach((item) => item.remove()); 

  const nickname = sessionStorage.getItem('user');
  
  user.forEach((e) => {
    const singleUser = document.createElement('li');
    singleUser.setAttribute('data-testid', 'online-user');
    singleUser.setAttribute('id', 'onlineUser');
    singleUser.innerText = e;
    if (nickname === e) {
      usersList.prepend(singleUser);
    } else {
      usersList.appendChild(singleUser);
    }
  });
};

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nickname = sessionStorage.getItem('user');
  const chatMessage = document.querySelector('#messageBox').value;
  socket.emit('message', { nickname, chatMessage });
  return false;
});

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newNickname = document.querySelector('#nicknameBox').value;
  // console.log(newNickname);
  socket.emit('changeNick', newNickname);
  return false;
});

window.addEventListener('load', async () => {
  const dbMessages = await (await fetch('http://localhost:3000/messages')).json();

  dbMessages.forEach((e) => {
    const message = `${e.timestamp} - ${e.nickname}: ${e.message}`;
    createMessagesList(message);
  });
});

socket.on('message', (newMessage) => createMessagesList(newMessage));
socket.on('userNickname', (userNick) => createUsersList(userNick));
socket.on('currentUser', (user) => sessionStorage.setItem('user', user));
socket.on('userDisconnect', (userOut) => createUsersList(userOut));