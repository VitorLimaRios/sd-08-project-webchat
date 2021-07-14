const { io } = window;

const socket = io();

let socketList = [];

const onMessage = (messages) => (newMessage) => {
  const li = document.createElement('li');

  li.setAttribute('data-testid', 'message');
  
  const { nickname } = socketList.find(({ id }) => id === socket.id);
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

const getMessageBoxInput = () => document.querySelector('input[data-testid="message-box"]');
const getSendBtn = () => document.querySelector('button[data-testid="send-button"]');
const getMessages = () => document.querySelector('#messages');

getSendBtn().addEventListener('click', (evt) => {
  evt.preventDefault();

  const chatMessage = getMessageBoxInput().value;
  const { nickname } = socketList.find(({ id }) => id === socket.id);

  socket.emit('message', { chatMessage, nickname });
  getMessageBoxInput().value = '';
});

socket.on('message', onMessage(getMessages()));

const onUpdateOnlineClients = (currentUsers) => (newSocketList) => {
  socketList = newSocketList;
  currentUsers.replaceChildren(...newSocketList.map(({ nickname }) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    li.className = 'inline-flex text-dark-50 mx-auto';
    li.innerText = nickname;
    return li;
  }));
};

const getNickNameInput = () => document.querySelector('input[data-testid="nickname-box"]');
const getSaveNicknameBtn = () => document.querySelector('button[data-testid="nickname-button"]');
const getCurrentUsers = () => document.querySelector('#current-users');

getSaveNicknameBtn().addEventListener('click', (evt) => {
  evt.preventDefault();

  const newNickname = getNickNameInput().value;
  socket.emit('updateNickname', { id: socket.id, nickname: newNickname });
  getNickNameInput().value = '';
});

socket.on('updateOnlineClients', onUpdateOnlineClients(getCurrentUsers()));

export default socket;