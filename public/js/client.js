const client = window.io();
const whoIsOnline = document.querySelector('#who-is-online');
const messageList = document.querySelector('#message-list');

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

/* client.on('enter', (person) => {
  const content = `Robocop: ${person} is here!`;
  const message = createMessage(content);
  messageList.append(message);
}); */

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

client.on('personList', (persons) => {
  try {
    renderWhoIsOnline(persons);
  } catch (err) { console.error(err); }
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
  try {
    e.preventDefault();
    const chatMessage = document.querySelector('#message-input').value;
    const nickname = sessionStorage.getItem('person');
    client.emit('message', { chatMessage, nickname });
  } catch (err) { console.error(err); }
});

document.querySelector('#person-form').addEventListener('submit', (e) => {
  try {
    e.preventDefault();
    const customPerson = document.querySelector('#nickname-input').value;
    sessionStorage.setItem('person', customPerson);
    client.emit('changePerson', customPerson);
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
