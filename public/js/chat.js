const socket = window.io();

const createMessage = (message) => {
  const messagesUl = document.querySelector('.messages');
  const newLi = document.createElement('li');
  newLi.innerText = message;
  messagesUl.appendChild(newLi);
};

socket.on('serverMessage', (message) => {
  console.log(message);
  createMessage(message)
});

window.onbeforeunload = socket.disconnect();