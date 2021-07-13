const socket = window.io();

const btnSaveNickName = document.querySelector('.save-nickname-button');
const ulOnlineUsers = document.querySelector('.onlineUsers');
const formSendMessage = document.querySelector('.form-send-message');
const txtMessage = document.querySelector('.input-message');

let nickname = '';

const setMessage = (chatMessage) => {
  const ulChatMessages = document.querySelector('.chatMessages');

  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = chatMessage;

  ulChatMessages.appendChild(li);
};

const addNewUsers = (users) => {
  ulOnlineUsers.innerHTML = '';
  
  const socketUser = users
    .find((user) => user.id === socket.id.slice(0, 16));

  const usersFilteredSocketUser = users
    .filter((user) => user.id !== socket.id.slice(0, 16));
  
  [socketUser, ...usersFilteredSocketUser].forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.nickname || user.id;
    li.setAttribute('data-testid', 'online-user');
    ulOnlineUsers.appendChild(li); 
  });
};

const getAllChatMessages = (messages = []) => {
  messages.forEach((message) => setMessage(message));
};

formSendMessage.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {
    chatMessage: txtMessage.value,
    nickname,
  };

  socket.emit('message', formData);
  txtMessage.value = '';

  return false;
});

btnSaveNickName.addEventListener('click', (e) => {
  const txtNickName = document.querySelector('.nickname');

  e.preventDefault();

  nickname = txtNickName.value;

  socket.emit('changeNickName', { nickname, id: socket.id.slice(0, 16) });
});

socket.on('message', (message) => setMessage(message));
socket.on('onlineUsers', (users) => addNewUsers(users));
socket.on('getAllChatMessages', (messages) => getAllChatMessages(messages));

window.onload = () => {
  socket.emit('onlineUsers');
  socket.emit('getAllChatMessages');
};

window.onbeforeunload = () => {
  socket.disconnect();
};
