const client = window.io();

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

const insertUser = (onlineUser) => {
  const liUser = document.createElement('li');
  liUser.innerText = onlineUser.nickName;
  liUser.setAttribute('data-testid', 'online-user');

  return liUser;
};

const reorderList = (receivedOnlineUsers) => {
  const thisNickName = getNickNameFromLocalStorage();
  for (let index = 0; index < receivedOnlineUsers.length; index += 1) {
    if (receivedOnlineUsers[index].nickName === thisNickName) {
      const reorderedUsers = [...receivedOnlineUsers.splice(index, 1), ...receivedOnlineUsers];
      return reorderedUsers;
    }
  }
};

const insertUserList = (receivedOnlineUsers) => {
  const userList = document.querySelector('#listUsers');
    userList.innerHTML = '';
    const reorderedList = reorderList(receivedOnlineUsers);
    return reorderedList.forEach((user) => {
      const userLine = insertUser(user);
      userList.append(userLine);
    });
};

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

const welcomeMessage = () => {
  const messageElementFromRobot = document.createElement('div');
  messageElementFromRobot.classList.add('msg-robot');

  // const nickName = getNickNameFromLocalStorage();
  
  const messageComponent = `
    <div class="msg-bubble">
      <div class="msg-text">
        Bem vindo
      </div>
    </div>
  `;

  messageElementFromRobot.innerHTML = messageComponent;

  return messageElementFromRobot;
};

// let onlineUsers;

client.on('confirmConnection', () => {
  const newMessageRobot = welcomeMessage();
  document.querySelector('#listMessages').append(newMessageRobot);

  client.emit('nickName', getNickNameFromLocalStorage());

  client.on('onlineUsers', (receivedOnlineUsers) => {
    // onlineUsers = receivedOnlineUsers;
    console.log('Qualquer nova conexão', receivedOnlineUsers);
    insertUserList(receivedOnlineUsers);
  });
});

client.on('clientExit', (receivedOnlineUsers) => {
  console.log('Quando um cliente se desconecta', receivedOnlineUsers);
  insertUserList(receivedOnlineUsers);
});

document.querySelector('#formSetNickName').addEventListener('submit', (e) => {
  e.preventDefault();

  const newNickName = document.querySelector('#nickNameInput').value;

  setNickNameInLocalStorage(newNickName);
  client.emit('nickName', getNickNameFromLocalStorage());
  client.on('onlineUsers', (receivedOnlineUsers) => {
    // onlineUsers = receivedOnlineUsers;
    console.log('Qualquer nova conexão', receivedOnlineUsers);
    insertUserList(receivedOnlineUsers);
  });
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