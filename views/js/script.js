const client = window.io();

const activeUsers = document.querySelector('.usersOn');

// https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/
function randomStringGenerator(size) {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < size; i += 1) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
}

window.onload = () => {
  const randomNickname = randomStringGenerator(16);
  client.emit('newUser', randomNickname);
  localStorage.setItem('user', JSON.stringify(randomNickname));

  client.emit('onlineUsers', '');
};

client.on('onlineUsers', (clients) => {
  // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  clients.sort((a, b) => {
    if (a.nickname > b.nickname) {
      return 1;
    }
    if (a.nickname < b.nickname) {
      return -1;
    }
    return 0;
  });
  // console.log(clients, "ordered clients");

  clients.forEach((cli) => {
    const userElement = document.createElement('li');
    userElement.setAttribute('data-testid', 'online-user');
    userElement.innerText = cli.nickname;
    activeUsers.appendChild(userElement);
  });
});

const createMessage = (message) => {
  const messageElement = document.createElement('li');
  messageElement.classList.add('msg');
  messageElement.setAttribute('data-testid', 'message');
  messageElement.innerHTML = message;
  return messageElement;
};

client.on('sendMessageToClients', ({ message }) => {
  const newMessageUser = createMessage(message);
  document.querySelector('.message-history').append(newMessageUser);
});