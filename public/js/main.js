const client = window.io();
const messagesContainer = document.querySelector('.messages-container');
const onlineUsersContainer = document.querySelector('.online-users-container');
const sendMessageButton = document.querySelector('.send-message-button');
const messageInput = document.querySelector('.message-input');
const changeNicknameButton = document.querySelector('.change-nickname-button');
const nicknameInput = document.querySelector('.nickname-input');

const renderNewMessage = (innerText) => {
  const message = document.createElement('li');
  message.dataset.testid = 'message';
  message.innerText = innerText;
  return messagesContainer.appendChild(message);
};

const renderOnlineUsers = (users) => {
  onlineUsersContainer.innerHTML = '';

  return users.forEach((user) => {
    const userNickname = document.createElement('li');
    userNickname.dataset.testid = 'online-user';
    userNickname.innerText = user.nickname;
    onlineUsersContainer.appendChild(userNickname);
  });
};

let nickname = '';

client.on('connect', () => {
  nickname = client.id.slice(0, 16);
  client.emit('newUser', nickname);

  sendMessageButton.addEventListener('click', (event) => {
    event.preventDefault();
    client.emit('message', { chatMessage: messageInput.value, nickname });
  });

  changeNicknameButton.addEventListener('click', () => {
    nickname = nicknameInput.value;
    client.emit('updateNickname', { id: client.id, newNickname: nickname });
    nicknameInput.value = '';
  });
});

client.on('emitMessage', (message) => renderNewMessage(message));
client.on('usersOnline', (users) => renderOnlineUsers(users));