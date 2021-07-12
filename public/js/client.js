const client = window.io();

const createClientMessage = (message) => {
  const messageElementFromClient = document.createElement('div');
  messageElementFromClient.classList.add('msg');
  
  const messageComponent = `
    <div class="msg-bubble">
      <div class="msg-text" data-testid="message">
        ${message}
      </div>
    </div>
  `;
  messageElementFromClient.innerHTML = messageComponent;
  return messageElementFromClient;
};

// Referência: https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/

const generateNickName = () => {
  let randomString = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i += 1) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
};

const setNickNameInLocalStorage = (nickName) => {
  localStorage.setItem('nickName', nickName);
};

const getNickNameFromLocalStorage = () => {
  if (localStorage.getItem('nickName')) {
    return localStorage.getItem('nickName');
  } 
    const nickName = generateNickName();
    setNickNameInLocalStorage(nickName);
    return nickName;
};

const welcomeMessage = () => {
  const messageElementFromRobot = document.createElement('div');
  messageElementFromRobot.classList.add('msg-robot');

  const nickName = getNickNameFromLocalStorage();
  
  const messageComponent = `
    <div class="msg-bubble">
      <div class="msg-text">
        Bem vindo
      </div>
      <div class="msg-text" data-testid="online-user">
        ${nickName}
      </div>
    </div>
  `;

  messageElementFromRobot.innerHTML = messageComponent;

  return messageElementFromRobot;
};

client.on('confirmConnection', () => {
  const newMessageRobot = welcomeMessage();
  document.querySelector('#listMessages').append(newMessageRobot);
});

// client.on('newUserConnect', (user) => {
//   const newMessageUser = createClientMessage(user.name, 'Entrou no chat!', user.avatar);
//   document.querySelector('#listMessages').append(newMessageUser);
// });

// client.on('clientExit', (obj) => {
//   console.log(obj);
//   const newMessageUser = createClientMessage('Chat Admin', `${obj.name} saiu do chat!`, '');
//   document.querySelector('#listMessages').append(newMessageUser);
// });

document.querySelector('#formSetNickName').addEventListener('submit', (e) => {
  e.preventDefault();

  const newNickName = document.querySelector('#nickNameInput').value;

  setNickNameInLocalStorage(newNickName);
});

document.querySelector('#formSendMessage').addEventListener('submit', (e) => {
  e.preventDefault();

  const chatMessage = document.querySelector('#messageInput').value;

  const nickname = getNickNameFromLocalStorage();

  client.emit('message', { chatMessage, nickname });
});

client.on('message', (message) => {
  const newMessageUser = createClientMessage(message);
  document.querySelector('#listMessages').append(newMessageUser);
});