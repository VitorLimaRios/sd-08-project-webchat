const socket = window.io();

// const { nickname, chatMessage } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true });

const form = document.querySelectorAll('form')[1];
const input = document.querySelectorAll('input');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!input[1].value || !input[0].value) {
    window.alert('Nickname ou mensagem em branco.');
    return;
  }
  socket.emit('message', { 
    chatMessage: input[0].value,
    nickname: input[1].value,
  });
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('.messages');
  const newLi = document.createElement('li');
  newLi.innerText = message;
  messagesUl.appendChild(newLi);
};

socket.on('serverMessage', (message) => createMessage(message));

// window.onbeforeunload = () => socket.disconnect();