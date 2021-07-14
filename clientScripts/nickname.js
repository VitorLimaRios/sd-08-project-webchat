// eslint-disable-next-line import/extensions
import socketList from './socketList.js';

const onUpdateOnlineClients = (currentUsers) => (newSocketList) => {
  socketList.data = newSocketList;
  currentUsers.replaceChildren(...newSocketList.map(({ nickname }) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    li.className = 'inline-flex text-dark-50 mx-auto';
    li.innerText = nickname;
    return li;
  }));
};

export default function (socket) {
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
}