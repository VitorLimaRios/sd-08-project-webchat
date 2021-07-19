const client = window.io();

// https://stackoverflow.com/questions/52713660/create-a-javascript-function-which-generates-a-random-character-id-comprising-o/58180485
const randomNickName = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.toLowerCase().split('');
  let nickname = '';
  for (let i = 0; i < 16; i += 1) {
    const RandomNumber = Math.floor(Math.random() * 26);
    nickname += alphabet[RandomNumber];
  }
  return nickname;
};

const dataTestId = 'data-testid';

const nameLi = document.querySelector('.user');
let nickname = randomNickName();
nameLi.innerHTML = nickname;

const createUser = (newUser) => {
  const listElements = document.querySelector('.ul-list');
  const liElement = document.createElement('li');
  liElement.setAttribute(dataTestId, 'online-user');
  liElement.innerHTML = newUser.nickname;
  liElement.id = newUser.id;
  listElements.appendChild(liElement);
};

client.emit('newConnection', nickname);

client.on('newUser', (newUser) => {
  createUser(newUser);
});

client.on('newNickname', (user) => {
  const userElement = document.getElementById(`${user.id}`);
  userElement.innerText = user.nickname;
});

client.on('disconnected', (id) => {
  const userElement = document.getElementById(`${id}`);
  userElement.remove();
});

document.querySelector('.nickname-button').addEventListener('click', () => {
  nickname = document.querySelector('.nickname-box').value;
  nameLi.innerHTML = nickname;

  client.emit('newNickname', nickname);

  document.querySelector('.nickname-box').value = '';
});

client.on('users', (clients) => {
  clients.forEach((element) => {
    const listElements = document.querySelector('.ul-list');
    const liElement = document.createElement('li');
    liElement.innerText = element.nickname;
    liElement.setAttribute(dataTestId, 'online-user');
    liElement.id = element.id;
    listElements.appendChild(liElement);
  });
});

const createMessage = (message) => {
  const elementP = document.createElement('p');
  elementP.setAttribute(dataTestId, 'message');
  elementP.innerHTML = message;

  return elementP;
};

document.querySelector('.send-button').addEventListener('click', async () => {
  const chatMessage = document.querySelector('.input-message').value;

  client.emit('message', { chatMessage, nickname });

  document.querySelector('.input-message').value = '';
});

client.on('message', (message) => {
  const newMessageUser = createMessage(message);
  document.querySelector('.messages-list').append(newMessageUser);
});
