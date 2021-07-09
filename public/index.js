const socket = window.io();

const form = document.querySelector('form');
const inputNome = document.querySelector('#staticEmail2');
const inputTexto = document.querySelector('#inputPassword2');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('sendMessage', {
    nome: inputNome.value,
    texto: inputTexto.value,
  });
  inputNome.value = '';
  inputTexto.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#lista');
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.innerText = message;
  messagesUl.appendChild(li);
};

socket.on('createMessage', (message) => createMessage(message));
