// eslint-disable-next-line import/extensions
import socketList from './socketList.js';

const onMessage = (socket, messages) => (newMessage) => {
  const li = document.createElement('li');

  li.setAttribute('data-testid', 'message');
  
  const { nickname } = socketList.data.find(({ id }) => id === socket.id);
  const captureNickname = /\d{1,2}:\d{1,2}(:\d{0,2})? ([\w'-]+) /;

  const messageNickname = newMessage.match(captureNickname)[2];

  if (messageNickname === nickname) {
    li.className = 'inline-flex ml-auto p-2 rounded-md bg-purple-400';
  } else {
    li.className = 'inline-flex mr-auto p-2 rounded-md bg-dark-50 text-light-50';
  }

  li.innerText = newMessage;

  messages.appendChild(li);
};

export default function (socket) {
  const getMessageBoxInput = () => document.querySelector('input[data-testid="message-box"]');
  const getSendBtn = () => document.querySelector('button[data-testid="send-button"]');
  const getMessages = () => document.querySelector('#messages');

  getSendBtn().addEventListener('click', (evt) => {
    evt.preventDefault();
  
    const chatMessage = getMessageBoxInput().value;
    const { nickname } = socketList.data.find(({ id }) => id === socket.id);

    socket.emit('message', { chatMessage, nickname });
    getMessageBoxInput().value = '';
  });

  socket.on('message', onMessage(socket, getMessages()));
}