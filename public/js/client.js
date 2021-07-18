const client = window.io();
const whoIsOnline = document.querySelector('#who-is-online');
const messageList = document.querySelector('#message-list');

const renderWhoIsOnline = (persons) => {
  const thisPerson = sessionStorage.getItem('person');
  const otherPersons = Object.values(persons).filter((person) => person !== thisPerson);
  whoIsOnline.innerHTML = '';

  [thisPerson, ...otherPersons].forEach((person) => {
    const personTag = document.createElement('li');
    personTag.setAttribute('data-testid', 'online-user');
    personTag.innerText = person;
    whoIsOnline.appendChild(personTag);
  });
};

const createMessage = (message) => {
  const messageTag = document.createElement('li');
  messageTag.setAttribute('data-testid', 'message');
  messageTag.innerText = message;
  return messageTag;
};

/* client.on('enter', (person) => {
  const content = `Robocop: ${person} is here!`;
  const message = createMessage(content);
  messageList.append(message);
}); */

client.on('listMessages', (messages) => {
  messageList.innerHTML = '';
  messages.forEach((msg) => {
    const content = `${msg.timestamp} - ${msg.nickname}: ${msg.message}`;
    const message = createMessage(content);
    messageList.append(message);
  });
});

client.on('setCurrentPerson', (person) => {
  sessionStorage.setItem('person', person);
});

client.on('personList', (persons) => {
  renderWhoIsOnline(persons);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const chatMessage = document.querySelector('#message-input').value;
  const nickname = sessionStorage.getItem('person');
  client.emit('message', { chatMessage, nickname });
});

document.querySelector('#person-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const customPerson = document.querySelector('#nickname-input').value;
  sessionStorage.setItem('person', customPerson);
  client.emit('changePerson', customPerson);
});

client.on('message', (content) => {
  const message = createMessage(content);
  messageList.append(message);
});

/* client.on('exit', (person) => {
  const content = `Robocop: ${person} said goodbye!`;
  const message = createMessage(content);
  messageList.append(message);
}); */
