const socket = window.io();

function randomString(length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; i -= 1) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

let random = randomString(16);
socket.emit('online', random);
socket.on('list', (list) => {
  list.map((item) => {
    const li = document.createElement('li');
    const ul = document.querySelector('.online');
    li.innerText = item;
    if (item === random) {
      ul.insertBefore(li, ul.firstChild);
      li.style.borderBottom = '1px solid red';
      li.setAttribute('id', `${random}`);
    } else {
      ul.appendChild(li);
      li.setAttribute('id', `${item}`);
    }
    return false;
  });
});

socket.on('removeName', (name) => {
  const ul = document.querySelector('.online');
  ul.removeChild(document.getElementById(`${name}`));
});

socket.on('updatelist', (name) => {
  const li = document.createElement('li');
  const ul = document.querySelector('.online');
  li.innerText = name;
  li.setAttribute('id', `${name}`);
  ul.appendChild(li);
});

const form = document.querySelectorAll('form');

form[1].addEventListener('submit', (event) => {
  const input = document.querySelector('[data-testid="message-box"]');
  const online = document.querySelector('.online').childNodes[0];
  event.preventDefault();
  if (!input.value) {
    window.alert('Mensagem em branco.');
    return;
  }
  socket.emit('message', { 
    chatMessage: input.value,
    nickname: online.innerText,
  });
});

form[0].addEventListener('submit', (event) => {
  const nickInput = document.querySelector('[data-testid="nickname-box"]').value;
  const nickname = document.querySelector('.online').childNodes[0];
  event.preventDefault();
  random = nickInput;
  socket.emit('updateName', random);
  nickname.innerText = random;
  nickname.setAttribute('id', `${random}`);
  // document.querySelector('.online').childNodes[0].innerText = random;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('.messages');
  const newLi = document.createElement('li');
  newLi.innerText = message;
  newLi.setAttribute('data-testid', 'message');
  newLi.setAttribute('class', 'message');
  messagesUl.insertBefore(newLi, messagesUl.lastChild);
};

socket.on('message', (message) => createMessage(message));

window.onbeforeunload = () => socket.disconnect();