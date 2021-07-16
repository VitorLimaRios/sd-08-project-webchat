const buttonSendMsg = document.querySelector('#send-button');
const inputNickName = document.querySelector('#nickName');
const inputTexto = document.querySelector('#message-box');
const nickNameButton = document.querySelector('#saveNickName');
const className = 'list-group-item';
// const className = 'list-group-item';

function nickAleatorio(tamanho) {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  let aleatorio = '';
  for (let i = 0; i < tamanho; i += 1) {
      const rnum = Math.floor(Math.random() * letras.length);
      aleatorio += letras.substring(rnum, rnum + 1);
  }
  return aleatorio;
}

let nick = `Guest${nickAleatorio(11)}`;
// const userLogado = [];

const socket = window.io('http://localhost:3000/', {
  query: {
    firstNickName: nick,
  },
});

const createLi = (string, addToUl) => {
  const li = document.createElement('li');
  li.className = className;
  li.innerText = string;
  li.dataset.testid = 'online-user';
  addToUl.appendChild(li);
};

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messageAdd');
  createLi(message, messagesUl);
};

buttonSendMsg.addEventListener('click', () => {
  socket.emit('message', {
    nickname: nick,
    chatMessage: inputTexto.value,
  });
  nick = '';
  inputTexto.value = '';
  return false;
});

const createMasterUser = ({ nickname }) => {
  nick = nickname;
  const userMasterUl = document.querySelector('#master');
  userMasterUl.innerText = '';
  createLi(nickname, userMasterUl);
};

socket.on('connectionMaster', (nickBK) => createMasterUser(nickBK));

const createListUser = (users) => {
  const userListUl = document.querySelector('#listUsers');
  userListUl.innerHTML = '';
  const excludeMaster = users.filter((user) => user.nickname !== nick);
  excludeMaster.forEach((user) => {
    const { nickname } = user;
    createLi(nickname, userListUl);
  });
};

socket.on('connectionUsers', (nickBK) => createListUser(nickBK));

nickNameButton.addEventListener('click', () => {
  if (inputNickName.value === '') {
    socket.emit('saveNickName', { nickname: 'Anonymous' });
    inputNickName.value = '';
    return false;
  }
  socket.emit('saveNickName', { nickname: inputNickName.value });
  inputNickName.value = '';
  return false;
});

socket.on('message', (msg) => createMessage(msg));
