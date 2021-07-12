const client = window.io();

const activeUsers = document.querySelector('.usersOn');

// const inputNick = document.querySelector('.nickBox');
// const upNickButton = document.querySelector('.nickButton');

const chatMessages = document.querySelector('.messageHistory');

// const imputMessage = document.querySelector('msgBox');
// const sendMessageButton = document.querySelector('sendButton');

// https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/
function randomStringGenerator(size) {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < size; i += 1) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
}

/* Conexão de novo cliente */
window.onload = () => {
  const randomNickname = randomStringGenerator(16);
  client.emit('newUser', randomNickname);
  localStorage.setItem('user', JSON.stringify(randomNickname));

  client.emit('onlineUsers', '');
};

/* Atualização de nickname */
// upNickButton.addEventListener('click', () => {
//   localStorage.setItem('user', JSON.stringify(inputNick.value));
//   nickname = inputNick.value;
//   client.emit('updateUser', nickname);
//   inputNick.value = '';
// });

client.on('onlineUsers', (clients) => {
  activeUsers.innerText = '';
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

// upNickButton.addEventListener('click', () => {
//   localStorage.setItem('user', JSON.stringify(inputNick.value));
//   nickname = inputNick.value;
//   client.emit('updateUser', nickname);
//   inputNick.value = '';
// });

client.on('newUser', (nickname) => {
  const element = document.createElement('li');
  element.innerText = `${nickname} entrou`;
  chatMessages.appendChild(element);
});

// const createMessage = (message) => {
//   const messageElement = document.createElement('li');
//   messageElement.setAttribute('data-testid', 'message');
//   messageElement.innerHTML = message;
//   return messageElement;
// };

// client.on('message', ({ message }) => {
//   const newMessageUser = createMessage(message);
//   document.querySelector('.messageHistory').append(newMessageUser);
// });