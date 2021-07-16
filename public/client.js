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

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messageAdd');
  const li = document.createElement('li');
  li.className = className;
  li.innerText = message;
  li.dataset.testid = 'message';
  messagesUl.appendChild(li);
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
  const li = document.createElement('li');
  li.className = className;
  li.id = 'online';
  li.innerText = nickname;
  li.dataset.testid = 'online-user';
  userMasterUl.appendChild(li);
};

socket.on('connectionMaster', (nickBK) => createMasterUser(nickBK));

const createListUser = (users) => {
  const userListUl = document.querySelector('#listUsers');
  userListUl.innerHTML = '';
  const excludeMaster = users.filter((user) => user.nickname !== nick);
  excludeMaster.forEach((user) => {
    const li = document.createElement('li');
    li.className = className;
    li.id = 'online';
    li.innerText = user.nickname;
    li.dataset.testid = 'online-user';
    userListUl.appendChild(li);
  });
};

socket.on('connectionUsers', (nickBK) => createListUser(nickBK));

// const editMasterUser = (nickname) => {
//   nick = nickname;
//   const userMasterUl = document.querySelector('#master');
//   userMasterUl.innerHTML = '';
//   const li = document.createElement('li');
//   li.className = className;
//   li.id = 'online';
//   li.innerText = nick;
//   li.dataset.testid = 'online-user';
//   userMasterUl.appendChild(li);
// };

// socket.on('editMasterUser', (nickBK) => editMasterUser(nickBK));

// const editListUsers = (users) => {
//   const userListUl = document.querySelector('#listUsers');
//   userListUl.innerHTML = '';
//   const excludeMaster = users.filter((user) => user.nickname !== nick);
//   excludeMaster.forEach((user) => {
//     const li = document.createElement('li');
//     li.className = className;
//     li.id = 'online';
//     li.innerText = user.nickname;
//     li.dataset.testid = 'online-user';
//     userListUl.appendChild(li);
//   });
// };

// socket.on('editListUsers', (nickBK) => editListUsers(nickBK));

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
