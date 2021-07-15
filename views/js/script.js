const client = window.io();

const nicknameInput = document.querySelector('.nickname-input');
const saveNickname = document.querySelector('.save-nickname-btn');
const messageInput = document.querySelector('.message-input');
const sendMessage = document.querySelector('.send-message-btn');
const onlineUsers = document.querySelector('.online-users');
const messagesContainer = document.querySelector('.messages-container');

const handleSetRandomNickname = () => {
  let randomNickname = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i += 1) {
    randomNickname += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomNickname;
};

window.onload = () => {
  const randomNickname = handleSetRandomNickname();
  client.emit('new-user', randomNickname);
  localStorage.setItem('user', JSON.stringify(randomNickname));

  client.emit('online-users', '');
};

client.on('new-user', (nickname) => {
  const userItem = document.createElement('li');
  userItem.innerText = `${nickname} has logged in.`;
  messagesContainer.appendChild(userItem);
});

client.on('online-users', (clients) => {
  onlineUsers.innerText = '';

  const newUser = clients.find((user) => user.id === client.id);
  const allUsers = clients.filter((user) => user.id !== client.id);
  allUsers.unshift(newUser);

  allUsers.forEach((user) => {
    const userItem = document.createElement('li');
    userItem.setAttribute('data-testid', 'online-user');
    userItem.innerText = user.nickname;
    onlineUsers.appendChild(userItem);
  });
});

sendMessage.addEventListener('click', () => {
  client.emit('message', {
    chatMessage: messageInput.value,
    nickname: JSON.parse(localStorage.getItem('user')),
  });
  messageInput.value = '';
});

client.on('message', (message) => {
  const messageItem = document.createElement('li');
  messageItem.innerText = message;
  messageItem.setAttribute('data-testid', 'message');
  messagesContainer.appendChild(messageItem);
});

saveNickname.addEventListener('click', () => {
  localStorage.setItem('user', JSON.stringify(nicknameInput.value));
  client.emit('update-user', nicknameInput.value);
  nicknameInput.value = '';
}); 

client.on('disconnect-user', () => {
  localStorage.clear();
});