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
function userUpdate() {
  const ul = document.querySelector('.user-list');
  ul.innerHTML = '';
  userList.forEach((userName) => {
    ul.innerHTML += `<li data-testid="online-user">${userName}</li>`;
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
  userUpdate();
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
      userUpdate();
    });
    client.emit('alter-nickname', newNickname);
  }
});
client.on('message', (message) => {
  messagesList.push(message);
  renderMessage();
});
client.on('user-desconected', (data) => {
  userList = data.list;
  client.emit('updateusers-server', userList);
  userUpdate();
});
client.on('list-update', (data) => {
  userList = data.list;
  userUpdate();
});
