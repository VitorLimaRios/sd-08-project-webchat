const socket = window.io();

const getMessageBoxInput = document.querySelector('input[data-testid="message-box"]');
const getSendBtn = document.querySelector('button[data-testid="send-button"]');
const getMessages = document.querySelector('#messages');
const getNickNameInput = document.querySelector('input[data-testid="nickname-box"]');
const getSaveNicknameBtn = document.querySelector('button[data-testid="nickname-button"]');
const getCurrentUsers = document.querySelector('#current-users');
let socketList = [];

const onMessage = (newMessage) => {
  const li = document.createElement('li');

  li.setAttribute('data-testid', 'message');
  
  // const socketObj = socketList.find(({ id }) => id === socket.id);
  // const captureNickname = /- ([\w'-]+): /;

  // const messageNickname = newMessage.match(captureNickname)[1];

  // if (socketObj && messageNickname === socketObj.nickname) {
  //   li.className = 'inline-flex ml-auto p-2 rounded-md bg-purple-400';
  // } else {
    li.className = 'inline-flex mr-auto p-2 rounded-md bg-dark-50 text-light-50';
  // }

  li.innerText = newMessage;

  getMessages.appendChild(li);
};

getSendBtn.addEventListener('click', (evt) => {
  evt.preventDefault();

  const chatMessage = getMessageBoxInput.value;
  const { nickname } = socketList.find(({ id }) => id === socket.id);

  socket.emit('message', { chatMessage, nickname });
  getMessageBoxInput.value = '';
});

socket.on('message', onMessage);

const buildLiNickname = (nickname) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.className = 'inline-flex text-dark-50 mx-auto';
  li.innerText = nickname;
  return li;
};

const onUpdateOnlineClients = (newSocketList) => {
  socketList = newSocketList;
  getCurrentUsers.innerHTML = '';
  newSocketList.forEach(({ id, nickname }) => {
    const li = buildLiNickname(nickname);
    if (socket.id === id) {
      getCurrentUsers.insertAdjacentElement('afterbegin', li);
    } else {
      getCurrentUsers.appendChild(li);
    }
  });
};

getSaveNicknameBtn.addEventListener('click', (evt) => {
  evt.preventDefault();

  const newNickname = getNickNameInput.value;
  socket.emit('updateNickname', { id: socket.id, nickname: newNickname });
  getNickNameInput.value = '';
});

socket.on('updateOnlineClients', onUpdateOnlineClients);

export default socket;