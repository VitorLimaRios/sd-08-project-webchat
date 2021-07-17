const socket = window.io();

const sendMessage = document.querySelector('#sendMessage');
const changeNickName = document.querySelector('#nickname-button');

const getCurrentUser = () => (
  document.querySelector('#online-user')
);

const dataTestid = 'data-testid';
const online = 'online-user';

const getUser = (nickname) => {
  const onlineUsersUl = document.querySelector('#showNicknames');
  const li = document.createElement('li');
  li.innerText = nickname;
  li.setAttribute('id', online);
  li.setAttribute(dataTestid, online);
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
  li.setAttribute(dataTestid, 'message');
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
  const users = onlineUsers.filter(
    (onlineUser) => onlineUser !== firstUser,
  );
  users.forEach((onlineUser) => {
    const li = document.createElement('li');
    li.innerText = onlineUser;
    li.setAttribute(dataTestid, online);
    onlineUsersUl.appendChild(li);
  });
};

const showMessages = (messages) => {
  if (messages !== null) {
    const messagesUl = document.querySelector('#showMessages');
    messagesUl.innerHTML = '';
    messages.forEach(({ message }) => {
      newMessage(message);
    });  
  }
};

socket.on('user', (user) => getUser(user));
socket.on('message', (message) => newMessage(message));
socket.on('usersOnline', (onlineUsers) => showUsers(onlineUsers));
socket.on('chat', (messages) => showMessages(messages));
