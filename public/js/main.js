const client = window.io();
const messagesContainer = document.querySelector('.messages-container');
const onlineUsersContainer = document.querySelector('.online-users-container');
const sendMessageButton = document.querySelector('.send-message-button');
const messageInput = document.querySelector('.message-input');
const changeNicknameButton = document.querySelector('.change-nickname-button');
const nicknameInput = document.querySelector('.nickname-input');
let id = '';
let nickname = '';

const renderNewMessage = (innerText) => {
  const message = document.createElement('li');
  message.dataset.testid = 'message';
  message.innerText = innerText;
  return messagesContainer.appendChild(message);
};

const renderOnlineUsers = (users) => {
  onlineUsersContainer.innerHTML = '';

  Object.entries(users).forEach((user) => {
    if (user[0] === id) {
      const userNickname = document.createElement('li');
      userNickname.dataset.testid = 'online-user';
      userNickname.innerText = user[1].nickname;
      onlineUsersContainer.appendChild(userNickname);
    }
  });

  Object.entries(users).forEach((user) => {
    if (user[0] !== id) {
      const chatMemberNickname = document.createElement('li');
      chatMemberNickname.dataset.testid = 'online-user';
      chatMemberNickname.innerText = user[1].nickname;
      onlineUsersContainer.appendChild(chatMemberNickname);
    }
  });
};

client.on('connect', () => {
  id = client.id;
  nickname = client.id.slice(0, 16);
  client.emit('newUser', nickname);
});

sendMessageButton.addEventListener('click', () => {
  client.emit('message', { chatMessage: messageInput.value, nickname });
  messageInput.value = '';
});

changeNicknameButton.addEventListener('click', () => {
  nickname = nicknameInput.value;
  client.emit('updateNickname', { id, nickname });
  nicknameInput.value = '';
});

client.on('message', (message) => renderNewMessage(message));
client.on('usersOnline', (users) => renderOnlineUsers(users));