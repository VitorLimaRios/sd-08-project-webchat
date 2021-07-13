const { io } = window;

const socket = io();

const getNickNameInput = () => document.querySelector('input[data-testid="online-user"]');
const getSaveNicknameBtn = () => document.querySelector('#save-nickname');

getSaveNicknameBtn().addEventListener('click', (evt) => {
  evt.preventDefault();

  const newNickname = getNickNameInput().value;
  socket.emit('update_nickname', { id: socket.id, nickname: newNickname });
});

export default socket;