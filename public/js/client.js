const client = window.io();

// Reference: https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/
const generateNickName = () => {
  let randomString = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i += 1) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
};

let nickname = generateNickName();

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

const getHistoryMessages = async () => {
  const response = await fetch('http://localhost:3000/historicMessage');
  const messagesList = await response.json();
  return messagesList;
};

const renderHistoryMessages = async () => {
  const messagesList = await getHistoryMessages();
  messagesList.forEach(({ message, nickname: nickName, timestamp }) => {
    const completeMessage = `${timestamp} ${nickName} ${message}`;
    const newMessageUser = createClientMessage(completeMessage);
  document.querySelector('#listMessages').append(newMessageUser);
  });
};

client.on('confirmConnection', async () => {
  await renderHistoryMessages();

  client.emit('nickName', nickname);
});

client.on('onlineUsers', (receivedOnlineUsers) => {
  insertUserList(receivedOnlineUsers, nickname);
});

client.on('clientExit', (receivedOnlineUsers) => {
  insertUserList(receivedOnlineUsers, nickname);
});

client.on('message', (message) => {
  const newMessageUser = createClientMessage(message);
  document.querySelector('#listMessages').append(newMessageUser);
});

const changeNickname = () => {
  document.querySelector('#formSetNickName').addEventListener('submit', (e) => {
    e.preventDefault();
    const newNickName = document.querySelector('#nickNameInput').value;
    nickname = newNickName;
    client.emit('nickName', nickname);
   });
};
changeNickname();

const sendMessage = () => {
  document.querySelector('#formSendMessage').addEventListener('submit', (e) => {
    e.preventDefault();
    const chatMessage = document.querySelector('#messageInput').value;
    client.emit('message', { chatMessage, nickname });
  });
};
sendMessage();
