const socket = window.io();

const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getLocalStorage = (key) => {
  const result = JSON.parse(localStorage.getItem(key));
  if (!result) return false;
  return result;
};

const createElement = ({ tag, className, message }) => {
  const element = document.createElement(tag);
  element.classList.add(className);
  element.innerText = message;
  return element;
};

const updateListUsers = (list) => {
  const listUsers = document.getElementById('list_users');
  listUsers.innerHTML = '';
  Object.values(list).forEach(({ nickname }) => {
    const li = createElement({ tag: 'li', message: nickname });
    li.setAttribute('data-testid', 'online-user');
    listUsers.appendChild(li);
  });
};

const updateNickname = () => {
  const form = document.forms.form_nickname;
  form.addEventListener('submit', async (e) => {
    const nickname = e.target.children.nickname.value;
    e.preventDefault();
    await setLocalStorage(socket.id.substr(0, 16), nickname);
    socket.emit('users', {
      nickname,
    });
  });
};

const sendMessage = () => {
  const form = document.forms.form_send;
  form.addEventListener('submit', async (e) => {
    const chatMessage = e.target.children.message.value;
    const nickname = await getLocalStorage(socket.id.substr(0, 16)) || socket.id.substr(0, 16);
    e.preventDefault();

    socket.emit('message', {
      nickname,
      chatMessage,
    });

    document.getElementById('message').value = '';
  });
};

const newMessage = (message) => {
  const chat = document.getElementById('chat_message');
  const p = createElement({ tag: 'p', className: 'user', message });
  p.setAttribute('data-testid', 'message');
  chat.appendChild(p);
};

window.onload = () => {
  socket.on('message', (message) => newMessage(message));

  socket.on('notification', ({ db, messageChannel }) => {
    updateListUsers(db);
    newMessage(messageChannel);
  });

  socket.on('welcome', ({ db }) => {
    updateListUsers(db);
  });

  socket.on('users', ({ db }) => {
    updateListUsers(db);
  });

  socket.on('logout', ({ db, messageChannel }) => {
    updateListUsers(db);
    newMessage(messageChannel);
  });

  updateNickname();
  sendMessage();
};
