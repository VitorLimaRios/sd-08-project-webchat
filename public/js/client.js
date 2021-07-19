const client = window.io();
const whoIsOnline = document.querySelector('#who-is-online');
const messageList = document.querySelector('#message-list');
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');
const personForm = document.querySelector('#person-form');
const nicknameInput = document.querySelector('#nickname-input');

const renderWhoIsOnline = (persons) => {
  try {
    const thisPerson = sessionStorage.getItem('person');
    const otherPersons = Object.values(persons).filter((person) => person !== thisPerson);
    whoIsOnline.innerHTML = '';
  
    [thisPerson, ...otherPersons].forEach((person) => {
      const personTag = document.createElement('li');
      personTag.setAttribute('data-testid', 'online-user');
      personTag.innerText = person;
      whoIsOnline.appendChild(personTag);
    });
  } catch (err) { console.error(err); }
};

const createMessage = (message) => {
  try {
    const messageTag = document.createElement('li');
    messageTag.setAttribute('data-testid', 'message');
    messageTag.innerText = message;
    return messageTag;
  } catch (err) { console.error(err); }
};

client.on('listMessages', (messages) => {
  try {
    messageList.innerHTML = '';
    messages.forEach((msg) => {
      const content = `${msg.timestamp} - ${msg.nickname}: ${msg.message}`;
      const message = createMessage(content);
      messageList.append(message);
    });
  } catch (err) { console.error(err); }
});

client.on('setCurrentPerson', (person) => {
  try {
    sessionStorage.setItem('person', person);
  } catch (err) { console.error(err); }
});

client.on('personList', (person) => {
  try {
    renderWhoIsOnline(person);
  } catch (err) { console.error(err); }
});

client.on('message', (content) => {
  try {
    const message = createMessage(content);
    messageList.append(message);
  } catch (err) { console.error(err); }
});

/* client.on('exit', (person) => {
  const content = `Robocop: ${person} said goodbye!`;
  const message = createMessage(content);
  messageList.append(message);
}); */

/* client.on('enter', (person) => {
  const content = `Robocop: ${person} is here!`;
  const message = createMessage(content);
  messageList.append(message);
}); */

messageForm.addEventListener('submit', (e) => {
  try {
    e.preventDefault();
    const chatMessage = messageInput.value;
    const nickname = sessionStorage.getItem('person');
    client.emit('message', { chatMessage, nickname });
  } catch (err) { console.error(err); }
});

personForm.addEventListener('submit', (e) => {
  try {
    e.preventDefault();
    const customPerson = nicknameInput.value;
    sessionStorage.setItem('person', customPerson);
    client.emit('changePerson', customPerson);
  } catch (err) { console.error(err); }
});
