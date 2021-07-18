const client = window.io();

const randomNickName = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.toLowerCase().split('');
  let nickname = '';
  for (let i = 0; i < 16; i += 1) {
    const RandomNumber = Math.floor(Math.random() * 26);
    nickname += alphabet[RandomNumber];
  }
  return nickname;
};

const allNicknames = JSON.parse(localStorage.getItem('nicknames')) || [];
let nickname = randomNickName();
localStorage.setItem('nicknames', JSON.stringify([...allNicknames, nickname]));

const createMessage = (message) => {
  const elementP = document.createElement('p');
  const component = `<p data-testid="message">${message}</p>`;
  elementP.innerHTML = component;
  return elementP;
};

const createUser = (usersList) => {
  usersList.forEach((element) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    li.innerHTML = element;
    const ulList = document.querySelector('.ul-list');
    ulList.append(li);
  });
};
createUser(JSON.parse(localStorage.getItem('nicknames')));

document.querySelector('.send-button').addEventListener('click', () => {
  const chatMessage = document.querySelector('.input-message').value;
  client.emit('message', { chatMessage, nickname });
  document.querySelector('.input-message').value = '';
});

client.on('message', (message) => {
  const newMessage = createMessage(message);
  document.querySelector('.messages-list').append(newMessage);
});

document.querySelector('.nickname-button').addEventListener('click', () => {
  const newNickname = document.querySelector('.nickname-box').value;
  const allNamesStorage = JSON.parse(localStorage.getItem('nicknames'));
  const newArrayNames = allNamesStorage.map((element) => {
    if (element === nickname) {
      return newNickname;
    }
    return element;
  });

  localStorage.setItem('nicknames', JSON.stringify(newArrayNames));
  nickname = newNickname;
  document.querySelector('.nickname-box').value = '';
});
