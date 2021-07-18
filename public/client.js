// const Model = require('../models/chatModel');
// const {
//   chatModel: {
//     writeMessage,
//     readMessages,
//   },
// } = require('../models');

const buttonSendMsg = document.querySelector('#send-button');
const inputNickName = document.querySelector('#nickName');
const inputTexto = document.querySelector('#message-box');
const nickNameButton = document.querySelector('#saveNickName');

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

const socket = window.io('http://localhost:3000/', {
  query: {
    firstNickName: nick,
  },
});

const createUserLi = (string, addToUl) => {
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.innerText = string;
  li.dataset.testid = 'online-user';
  addToUl.appendChild(li);
};

const createMessagesLi = (string, addToUl) => {
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.innerText = string;
  li.dataset.testid = 'message';
  addToUl.appendChild(li);
};

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messageAdd');
  createMessagesLi(message, messagesUl);
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
  createUserLi(nickname, userMasterUl);
};

socket.on('connectionMaster', (nickBK) => createMasterUser(nickBK));

const createListUser = (users) => {
  const userListUl = document.querySelector('#listUsers');
  userListUl.innerHTML = '';
  const excludeMaster = users.filter((user) => user.nickname !== nick);
  excludeMaster.forEach((user) => {
    const { nickname } = user;
    createUserLi(nickname, userListUl);
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
