const socket = window.io();

const buttonMsg = document.querySelector('#button-message');
const nickNamebutton = document.querySelector('#nickname-btn');
const userNicknameInput = document.querySelector('#nickname');
const inputText = document.querySelector('#message-box');
let userNickname = '';
// let findNickName = localStorage.getItem('nickname');

// nickNamebutton.addEventListener('click', () => {
//   localStorage.setItem('nickname', userNicknameInput.value);
// });

const createMessage = (message) => {
  const messagesUl = document.querySelector('#list');
  const li = document.createElement('li');
  li.dataset.testid = 'message';
  li.innerText = message;
  messagesUl.appendChild(li);
};

buttonMsg.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', {
    nickname: userNickname,
    chatMessage: inputText.value,
  });
  userNickname = '';
  inputText.value = '';
  return false;
});

const createUser = (user) => {
  console.log(user);
  const messagesUl = document.querySelector('#online');
  const li = document.createElement('li');
  li.dataset.testid = 'online-user';
  li.innerText = user;
  messagesUl.appendChild(li);
};

nickNamebutton.addEventListener('click', (e) => {
  e.preventDefault();
  userNickname = userNicknameInput.value;
  socket.emit('onlineUser', userNickname);
  userNicknameInput.value = '';
  return false;
});

// função tirada de: https://www.ti-enxame.com/pt/javascript/gere-stringcaracteres-aleatorios-em-javascript/967048592/
const validName = (length) => {
  let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i += 1) {
          result += characters.charAt(Math.floor(Math.random() 
          * charactersLength));
        }
        return result;
};
if (!userNickname) {
  userNickname = validName(16);
}
createUser(userNickname);

socket.on('message', (message) => createMessage(message));
socket.on('onlineUser', (user) => createUser(user));
  // user.foreach((u) => {
  //   if (u !== userNickname) createUser(user);
  // });
