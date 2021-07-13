const socket = window.io();

const createElement = ({ tag, className, message }) => {
  const element = document.createElement(tag);
  element.classList.add(className);
  element.innerText = message;
  return element;
};

const sendMessage = () => {
  const form = document.getElementById('form_send');
  form.addEventListener('submit', (e) => {
  const chatMessage = e.target.children.message.value;
  e.preventDefault();

  socket.emit('message', {
    nickname: socket.id,
    chatMessage,
  });

  document.getElementById('message').value = '';
});
};

const newMessage = (message) => {
  const chat = document.getElementById('chat_message');
  const p = createElement({ tag: 'p', className: 'user', message });
  chat.appendChild(p);
};

window.onload = () => {
  socket.on('message', (message) => newMessage(message));
  sendMessage();
};