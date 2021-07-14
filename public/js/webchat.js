const socket = window.io();

const form = document.querySelector('form');
const inputMessage = document.querySelector('#messageInput');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', inputMessage.value);
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.id = 'message';
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

window.onbeforeunload = () => {
  socket.disconnect();
};

socket.on('message', (message) => createMessage(message));
