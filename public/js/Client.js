const socket = window.io();

const usersList = document.querySelector('#usersList');
const messagesList = document.querySelector('#messagesList');

const logUser = (nickname) => {
  const liUser = document.createElement('li');
  liUser.setAttribute('data-testid', 'online-user');
  liUser.innerHTML = nickname;
  usersList.appendChild(liUser);
};

const createMessage = (message) => {
  const liMessage = document.createElement('li');
  liMessage.setAttribute('data-testid', 'message');
  liMessage.textContent = message;
  messagesList.appendChild(liMessage);
};

// USERS SOCKETS

socket.on('yourNickname', (nickname) => {
  logUser(nickname);
  socket.emit('getUsers');
  socket.emit('getMessagesHistory');
});

socket.on('usersOnline', (onlineUsers) => {
  const nickname = usersList.firstElementChild.textContent;
  const usersOnline = Object.values(onlineUsers);
  usersOnline.forEach((user) => {
    if (user !== nickname) {
      logUser(user);
    }
  });
});

socket.on('newUser', (nickname) => {
  logUser(nickname);
});

socket.on('updatedUsers', (onlineUsers) => {
  const userNickname = usersList.firstElementChild.textContent;
  while (usersList.lastElementChild) {
    usersList.removeChild(usersList.lastElementChild);
  }
  logUser(userNickname);
  const usersOnline = Object.values(onlineUsers);
  usersOnline.forEach((user) => {
    if (user !== userNickname) {
      logUser(user);
    }
  });
});

const nicknameForm = document.getElementById('nicknameForm');

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nickname = document.getElementById('nicknameInput').value;
  if (nickname) {
    const userNickname = usersList.firstElementChild;
    userNickname.textContent = nickname;
    socket.emit('updateNickname', nickname);
    document.getElementById('nicknameInput').value = '';
  }
});

// MESSAGES SOCKETS

socket.on('messageHistory', (messages) => {
  messages.forEach((message) => {
    createMessage(message);
  });
});

socket.on('message', (message) => {
  createMessage(message);
});

const form = document.getElementById('messageForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (document.getElementById('messageInput').value) {
    const nickname = usersList.firstElementChild.textContent;
    const chatMessage = document.getElementById('messageInput').value;
    socket.emit('message', { chatMessage, nickname });
    document.getElementById('messageInput').value = '';
  }
});

window.onbeforeunload = (_event) => {
  socket.disconnect();
};
