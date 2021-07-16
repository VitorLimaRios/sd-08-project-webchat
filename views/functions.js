const socket = window.io();

const sendMessage = document.querySelector('#sendMessage');
const changeNickName = document.querySelector('#nickname-button');

const getCurrentUser = () => (
  document.querySelector('#online-user')
);

const getUser = (nickname) => {
  const onlineUsersUl = document.querySelector('#showNicknames');
  const li = document.createElement('li');

  li.innerText = nickname;
  li.setAttribute('id', 'online-user');
  li.setAttribute('data-testid', 'online-user');

  onlineUsersUl.appendChild(li);
};

sendMessage.addEventListener('click', (e) => {
  e.preventDefault();
  const chatMessage = document.querySelector('#message-box');
  const nickname = getCurrentUser().innerText;

  socket.emit('message', { chatMessage: chatMessage.value, nickname });
  chatMessage.value = '';

  return false;
});

const newMessage = (message) => {
  const messagesUl = document.querySelector('#showMessages');
  const li = document.createElement('li');

  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li);
};

changeNickName.addEventListener('click', (e) => {
  e.preventDefault();
  const newNickname = document.querySelector('#nickname-box');
  const prevNickname = getCurrentUser();

  socket.emit('updateNickName', {
    prevNickname: prevNickname.innerText,
    newNickname: newNickname.value,
  });
  prevNickname.innerText = newNickname.value;
  newNickname.value = '';

  return false;
});

const showUsers = (onlineUsers) => {
  const firstUser = getCurrentUser().innerText;
  const onlineUsersUl = document.querySelector('#showNicknames');
  onlineUsersUl.innerHTML = '';
  getUser(firstUser);

  if (onlineUsers == null) {
    return null;
  }

  const users = onlineUsers.filter(
    (onlineUser) => onlineUser.nickname !== firstUser,
  );
  
  users.forEach((onlineUser) => {
    const li = document.createElement('li');
    li.innerText = onlineUser.nickname;
    onlineUsersUl.appendChild(li);
  });
};

socket.on('user', (user) => getUser(user));
socket.on('message', (message) => newMessage(message));
socket.on('usersOnline', (onlineUsers) => showUsers(onlineUsers));
