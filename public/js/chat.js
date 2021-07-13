const socket = window.io();

// const { nickname, chatMessage } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true });
function randomString(length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; i -= 1) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

const random = randomString(16);
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
    }
    socket.on('removeName', (name) => ul.removeChild(document.getElementById(`${name}`)));
    return false;
  });
});

socket.on('updatelist', (name) => {
  const li = document.createElement('li');
  const ul = document.querySelector('.online');
  li.innerText = name;
  li.setAttribute('id', `${name}`);
  ul.appendChild(li);
});

const form = document.querySelectorAll('form')[1];
const input = document.querySelectorAll('input');
const online = document.querySelector('.online').childNodes[1];
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!input[1].value) {
    window.alert('Nickname ou mensagem em branco.');
    return;
  }
  socket.emit('message', { 
    chatMessage: input[1].value,
    nickname: online.innerText,
  });
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