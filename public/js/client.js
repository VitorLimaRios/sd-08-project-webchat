const client = window.io();
const whoIsOnline = document.querySelector('#who-is-online');
const messageList = document.querySelector('#message-list');
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');
const personForm = document.querySelector('#person-form');
const nicknameInput = document.querySelector('#nickname-input');

const renderWhoIsOnline = (persons) => { // Referência: Thays Costa T07
  try {
    const thisPerson = sessionStorage.getItem('person');
    const otherPersons = Object.values(persons).filter((person) => person !== thisPerson);
    const everyPersonOnline = [thisPerson, ...otherPersons];
    whoIsOnline.innerHTML = '';
    everyPersonOnline.forEach((person) => {
      const personElement = document.createElement('li');
      personElement.setAttribute('data-testid', 'online-user');
      personElement.innerText = person;
      whoIsOnline.appendChild(personElement);
    });
  } catch (err) { console.error(err); }
};

const createMessage = (content) => {
  try {
    const messageElement = document.createElement('li');
    messageElement.setAttribute('data-testid', 'message');
    messageElement.innerText = content;
    return messageElement;
  } catch (err) { console.error(err); }
};

client.on('listMessages', (messages) => {
  try {
    messageList.innerHTML = '';
    messages.forEach((msg) => {
      const content = `${msg.timestamp} - ${msg.nickname}: ${msg.message}`;
      const messageElement = createMessage(content);
      messageList.append(messageElement);
    });
  } catch (err) { console.error(err); }
});

client.on('setCurrentPerson', (person) => {
  try {
    sessionStorage.setItem('person', person);
  } catch (err) { console.error(err); }
});

client.on('personListUpdate', (person) => {
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
