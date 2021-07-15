const socket = window.io();

const dataTestid = 'data-testid';
const myOnlineUser = 'my-online-user';

function addUserOn(user) {
  socket.emit('addOn', user);
}

// Criar Nick
socket.on('newUser', ({ newUser, onlineUsers }) => {
  const nickElemente = document.createElement('li');
  nickElemente.setAttribute('id', myOnlineUser);
  nickElemente.setAttribute(dataTestid, 'online-user');
  nickElemente.innerHTML = newUser.nickname;
  document.querySelector('#online-user-list').appendChild(nickElemente);

  addUserOn(newUser.nickname);
});

// renderizar menssagens do banco
socket.on('newConnection', (messages) => {
  messages.forEach((message) => {
    const menssageElement = document.createElement('li');
    menssageElement.setAttribute('id', 'message');
    menssageElement.setAttribute(dataTestid, 'message');
    menssageElement.setAttribute('class', 'media');
    menssageElement.innerHTML = message;
    document.querySelector('#messages').appendChild(menssageElement);
  });
});

// alterar Nick
function clearTextAreaNick() {
  const nickText = document.getElementById('nickname-box');
  nickText.value = '';
}

function changeNick() {
  const newNick = document.querySelector('#nickname-box').value;
  socket.emit('changeNick', newNick);

  clearTextAreaNick();
}

socket.on('user', (newUser) => {
  document.getElementById(myOnlineUser).innerHTML = newUser.nickname;
});

socket.on('changeNiks', (newUser) => {
  const alterouNick = document.querySelector(`.${newUser.socketId}`);
  alterouNick.innerHTML = newUser.nickname;
});

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// remover
socket.on('remover', (removido) => {
  const ul = document.querySelector('#online-user-list');
  removeAllChildNodes(ul);

  removido.forEach(user => {
    console.log(user.nickname);
    if (user.socketId === socket.id) {
      const nickElemente = document.createElement('li');
      nickElemente.setAttribute('id', 'my-online-user');
      nickElemente.setAttribute(dataTestid, 'online-user');
      nickElemente.setAttribute('class', `${user.socketId}`);
      nickElemente.innerHTML = user.nickname;
      document.querySelector('#online-user-list').appendChild(nickElemente);
    } else {
      const nickElemente = document.createElement('li');
      nickElemente.setAttribute('id', 'online-user');
      nickElemente.setAttribute(dataTestid, 'online-user');
      nickElemente.setAttribute('class', `${user.socketId}`);
      nickElemente.innerHTML = user.nickname;
      document.querySelector('#online-user-list').appendChild(nickElemente);
    }
  });
});

// enviar mensagem
function creatMenssage() {
  const chatMessage = document.getElementById('message-box').value;
  const nickname = document.getElementById(myOnlineUser).innerHTML;
  socket.emit('message', { chatMessage, nickname });
}

// Adicionar mensagem
function clearTextArea() {
  const messageText = document.getElementById('message-box');
  messageText.value = '';
}

socket.on('message', (message) => {
  const menssageElement = document.createElement('li');
  menssageElement.setAttribute('id', 'message');
  menssageElement.setAttribute(dataTestid, 'message');
  menssageElement.setAttribute('class', 'media');
  menssageElement.innerHTML = message;
  document.querySelector('#messages').appendChild(menssageElement);

  clearTextArea();
});

// receber outros Users
// acabou de entrar
socket.on('peopleInChat', (onlineUsers) => {
  onlineUsers.forEach(user => {
    if (user.socketId === socket.id) return;
    const nickElemente = document.createElement('li');
    nickElemente.setAttribute('id', 'online-user');
    nickElemente.setAttribute(dataTestid, 'online-user');
    nickElemente.setAttribute('class', `${user.socketId}`);
    nickElemente.innerHTML = user.nickname;
    document.querySelector('#online-user-list').appendChild(nickElemente);
  });
});

// novos entrando
socket.on('newOneInChat', (newUser) => {
  const nickElemente = document.createElement('li');
  nickElemente.setAttribute('id', 'online-user');
  nickElemente.setAttribute(dataTestid, 'online-user');
  nickElemente.setAttribute('class', `${newUser.socketId}`);
  nickElemente.innerHTML = newUser.nickname;
  document.querySelector('#online-user-list').appendChild(nickElemente);
});

window.close(socket.emit('disconnect', newUser))