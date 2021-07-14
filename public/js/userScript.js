const socket = window.io();

const formMessage = document.querySelector('#messageForm');
const inputMessage = document.querySelector('#messageToSend');
const formNickname = document.querySelector('#nicknameForm');

const userGenerator = (nickname) => {
  let userNickname;
  if (nickname) {
    userNickname = nickname;
    const user = { userNickname, id: socket.id };
    sessionStorage.setItem('nickname', userNickname);
    socket.emit('newNickname', user);
  } else {
    const token = (Math.random() * (9999999999 - 1000000000) + 1000000000).toFixed();
    userNickname = `guest-${token}`;
    if (userNickname !== 'undefined') {
      const user = { userNickname, id: '' };
      sessionStorage.setItem('nickname', userNickname);
      socket.emit('userIn', user);
    }
  }
};

formMessage.addEventListener('submit', (e) => {
  e.preventDefault();
  const userNickname = document.querySelector('.user');
  const dataMessage = { chatMessage: inputMessage.value, nickname: userNickname.innerText };
  socket.emit('message', dataMessage);
  inputMessage.value = '';
  return false;
});

formNickname.addEventListener('submit', (e) => {
  const inputNickname = document.querySelector('#nickname');
  e.preventDefault();
  const newNickname = inputNickname.value;
  userGenerator(newNickname);
  inputNickname.value = '';
  return false;
});

const newMessage = (message) => {
  const messageUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.className = 'message';
  li.dataset.testid = 'message';
  messageUl.appendChild(li);
};

socket.on('message', (message) => newMessage(message));

window.onload = () => {
  userGenerator();
};
