let userList = [];
let messagesList = [];
const sendButton = document.querySelector('#send-button');
const messageBox = document.querySelector('#message-box');
const nicknameBox = document.querySelector('#nickname-box');
const nicknameButton = document.querySelector('#nickname-button');
function generateNickname(length) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    const char = Math.floor(Math.random() * chars.length);
    result += chars.substring(char, char + 1);
  }
  return result;
}
function renderUserList(userJoined) {
  const ul = document.querySelector('.user-list');
  // ul.innerHTML = '';
  userList.forEach((user) => {
    if (user === userJoined) {
      ul.innerHTML += `<li data-testid="online-user">${user}</li>`;
    } else {
      ul.innerHTML += `<li>${user}</li>`;
    }
  });
}
function renderMessage() {
  const ul = document.querySelector('.chat-list');
  ul.innerHTML = '';
  messagesList.forEach((message) => {
    ul.innerHTML += `<li data-testid="message">${message}</li>`;
  });
}

const userName = generateNickname(16);

const client = window.io();

document.title = `Chat (${userName})`;
client.emit('join-request', userName);
client.on('user-ok', (data) => {
  userList = data.list;
  renderUserList(data.joined);
});
client.on('list-update', (data) => {
  userList = data.list;  
  renderUserList(data.joined);
});
client.on('messages-update', (data) => {
  messagesList = data.messages;
  renderMessage();
});

sendButton.addEventListener('click', (event) => {
  event.preventDefault();
  const message = messageBox.value;
  messageBox.value = '';
  if (message !== '') {
    client.emit('message', { chatMessage: message, nickname: userName });
  }
});
nicknameButton.addEventListener('click', (event) => {
  event.preventDefault();
  const newNickname = nicknameBox.value;
  nicknameBox.value = '';
  if (newNickname !== '') {
    document.title = `Chat (${newNickname})`;
    client.on('user-ok', (data) => {
      userList = data.list;
      renderUserList(data.joined);
    });
    client.emit('alter-nickname', newNickname);
  }
});
client.on('message', (message) => {
  messagesList.push(message);
  renderMessage();
});
