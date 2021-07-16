const socket = window.io();

const buttonSave = document.querySelector('#saveNickname');
const inputNickname = document.querySelector('#nickname');
const inputMessage = document.querySelector('#messageInput');
const userUL = document.querySelector('#userList');
const buttonMesssage = document.querySelector('#sendMessage');

const dataTestId = 'data-testid';

let myNickname;

// Ideia do slice peguei no plantão!
const randomNickname = (id) => {
  console.log('randomNickname', id);
  const nickname = id.slice(0, 16);
  console.log('randomNickname', nickname);
  myNickname = nickname;
  socket.emit('newUser', myNickname);
};

// Para trabalhar com manipulação DOM, estudei.:
// conteúdo course pegando como exemplo;
// vídeo youtube: Learn DOM Manipulation in 18 minutes
const createUserList = (user) => {
  const li = document.createElement('li');
  li.setAttribute(dataTestId, 'online-user');
  li.innerText = user;
  return userUL.appendChild(li);
};

// escutando botão Enviar
buttonMesssage.addEventListener('click', () => {
  const sendMessage = {
    chatMessage: inputMessage.value,
    nickname: myNickname, // nickname
  };
  socket.emit('message', sendMessage);
  inputMessage.value = '';
  return false;
});

// Criando mensagem no DOM
const createMessage = (message) => {
  console.log('message', message);
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.setAttribute(dataTestId, 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

// escutando botão Salvar
buttonSave.addEventListener('click', () => {
  myNickname = inputNickname.value;
  socket.emit('changeUser', myNickname);
  inputNickname.value = '';
  return false;
});

socket.on('connection', (id, messages) => {
  // cria um nickname!
  randomNickname(id);

  // mensagens salvas no banco de dados!
  messages.forEach((message) => {
    createMessage(`${message.timestamp} - ${message.nickname}: ${message.message}`);
  });
});

socket.on('message', (messages) => createMessage(messages));

socket.on('updateUsers', (users) => {
  userUL.innerHTML = '';
  
  // usuário conectado
  createUserList(myNickname);

  // demais usuário
  users.forEach((user) => {
    if (user !== myNickname) {
      return createUserList(user);
    }
  });
});
