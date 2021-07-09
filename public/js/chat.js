const socket = window.io();

socket.emit('userConnected');

const sendButton = document.querySelector('#send-button-id');
sendButton.addEventListener('click', () => {
  const nickname = localStorage.getItem(socket.id);
  const messageBox = document.querySelector('#message-box-id');
  socket.emit('message', { chatMessage: messageBox.value, nickname });
  messageBox.value = '';
});

const createOnlineUsers = (onlineUsers) => {
  const onlineUsersList = document.getElementById('users-list');
  while (onlineUsersList.firstChild) {
    onlineUsersList.removeChild(onlineUsersList.firstChild);
  }
  const onlineUsersNicknames = Object.values(onlineUsers);
  onlineUsersNicknames.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user;
    li.setAttribute('id', 'online-user');
    onlineUsersList.appendChild(li);
  });
};

socket.on('onlineUsers', (onlineUsers) => createOnlineUsers(onlineUsers));
socket.on('saveStorage', ({ socketId, nickname }) => localStorage.setItem(socketId, nickname));