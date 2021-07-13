const client = window.io();

const inputNick = document.querySelector('.nickBox');
const upNickButton = document.querySelector('.nickButton');
const inputMessage = document.querySelector('.msgBox');
const sendMessageButton = document.querySelector('.sendButton');
const activeUsers = document.querySelector('.usersOn');
const chatMessages = document.querySelector('.messageHistory');

// https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/
function randomStringGenerator(size) {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < size; i += 1) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
}

/* cliente se conecta */
window.onload = () => {
  const randomNickname = randomStringGenerator(16);
  client.emit('newUser', randomNickname);
  localStorage.setItem('user', JSON.stringify(randomNickname));

  client.emit('onlineUsers', '');
};

client.on('newUser', (nickname) => {
  const element = document.createElement('li');
  element.innerText = `${nickname} entrou`;
  chatMessages.appendChild(element);
});

client.on('onlineUsers', (clients) => {
  activeUsers.innerText = '';

  const newClient = clients.find((c) => c.userId === client.id);
  const allClients = clients.filter((c) => c.userId !== client.id);
  allClients.unshift(newClient); // novo cliente no topo da lista

  allClients.forEach((cli) => {
    const userElement = document.createElement('li');
    userElement.setAttribute('data-testid', 'online-user');
    userElement.innerText = cli.nickname;
    activeUsers.appendChild(userElement);
  });
});

/* mensagens enviadas */
sendMessageButton.addEventListener('click', () => {
  client.emit('message', {
    chatMessage: inputMessage.value,
    nickname: JSON.parse(localStorage.getItem('user')),
  });
  inputMessage.value = '';
});

client.on('message', (message) => {
  const element = document.createElement('li');
  element.innerText = message;
  element.setAttribute('data-testid', 'message');
  chatMessages.appendChild(element);
});

/* cliente atualiza seu _nickname_ */
upNickButton.addEventListener('click', () => {
  localStorage.setItem('user', JSON.stringify(inputNick.value));
  client.emit('updateUser', inputNick.value);
  inputNick.value = '';
}); 

/* cliente se desconecta */
client.on('disconnectUser', () => {
  localStorage.clear();
});