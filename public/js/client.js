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

// const setNickNameInLocalStorage = (nickName) => {
//   localStorage.setItem('nickName', nickName);
// };

// const getNickNameFromLocalStorage = () => {
//   if (localStorage.getItem('nickName')) {
//     return localStorage.getItem('nickName');
//   } 
//     const nickName = generateNickName();
//     // setNickNameInLocalStorage(nickName);
//     return nickName;
// };

const insertUser = (onlineUser) => {
  const liUser = document.createElement('li');
  liUser.innerText = onlineUser.nickname;
  liUser.setAttribute('data-testid', 'online-user');

  return liUser;
};

const reorderList = (receivedOnlineUsers, nickName) => {
  const thisNickName = nickName;
  for (let index = 0; index < receivedOnlineUsers.length; index += 1) {
    if (receivedOnlineUsers[index].nickname === thisNickName) {
      const reorderedUsers = [...receivedOnlineUsers.splice(index, 1), ...receivedOnlineUsers];
      return reorderedUsers;
    }
  }
};

const insertUserList = (receivedOnlineUsers, nickName) => {
  const userList = document.querySelector('#listUsers');
    userList.innerHTML = '';
    const reorderedList = reorderList(receivedOnlineUsers, nickName);
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

// const welcomeMessage = () => {
//   const messageElementFromRobot = document.createElement('div');
//   messageElementFromRobot.classList.add('msg-robot');

//   // const nickName = getNickNameFromLocalStorage();
  
//   const messageComponent = `
//     <div class="msg-bubble">
//       <div class="msg-text">
//         Bem vindo
//       </div>
//     </div>
//   `;

//   messageElementFromRobot.innerHTML = messageComponent;

//   return messageElementFromRobot;
// };

// let onlineUsers;

let nickname = generateNickName();

client.on('confirmConnection', async () => {
  const response = await fetch('http://localhost:3000/historicMessage');
  const messagesList = await response.json();

  messagesList.forEach(({ message, nickname: nickName, timestamp }) => {
    const completeMessage = `${timestamp} ${nickName} ${message}`;
    const newMessageUser = createClientMessage(completeMessage);
  document.querySelector('#listMessages').append(newMessageUser);
  });

  // const newMessageRobot = welcomeMessage();
  // document.querySelector('#listMessages').append(newMessageRobot);

  client.emit('nickName', nickname);
});

client.on('onlineUsers', (receivedOnlineUsers) => {
  console.log('Qualquer nova conexão', receivedOnlineUsers, nickname);
  insertUserList(receivedOnlineUsers, nickname);
});

client.on('clientExit', (receivedOnlineUsers) => {
  console.log('Quando um cliente se desconecta', receivedOnlineUsers);
  insertUserList(receivedOnlineUsers, nickname);
});

document.querySelector('#formSetNickName').addEventListener('submit', (e) => {
  e.preventDefault();

  const newNickName = document.querySelector('#nickNameInput').value;

  nickname = newNickName;

  client.emit('nickName', nickname);
  console.log('Cliente emite novo nickName', nickname);
 });

document.querySelector('#formSendMessage').addEventListener('submit', (e) => {
  e.preventDefault();

  const chatMessage = document.querySelector('#messageInput').value;
  
  console.log(nickname);
  client.emit('message', { chatMessage, nickname });
});

client.on('message', (message) => {
  const newMessageUser = createClientMessage(message);
  document.querySelector('#listMessages').append(newMessageUser);
});