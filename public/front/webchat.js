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

const addNewUsers = (users = []) => {
  ulOnlineUsers.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user;
    li.setAttribute('data-testid', 'online-user');
    ulOnlineUsers.appendChild(li); 
  });
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

window.onload = () => {
  socket.emit('onlineUsers');
};
