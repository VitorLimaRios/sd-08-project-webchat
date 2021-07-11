// https://github.com/tryber/sd-07-live-lectures/blob/lecture_32_3/chat-socket-io/public/js/client.js
const client = window.io();
        
const createMessage = (message) => {
  const messageElement = document.createElement('li');
  messageElement.classList.add('msg');
  messageElement.setAttribute('data-testid', 'message');
  messageElement.innerHTML = message;
  return messageElement;
};

client.on('sendMessageToClients', ({ message }) => {
  const newMessageUser = createMessage(message);
  document.querySelector('.message-history').append(newMessageUser);
});