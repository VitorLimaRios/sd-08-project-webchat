// Randon nickname generate
// https://codepen.io/jamesrbdev/pen/WxyKyr
const nameList = [
  'Game', 'Donkey', 'Mule', 'Cult', 'Cultist', 'Magnum', 'Rooster',
  'Fall', 'Jump', 'Cliff', 'Mountain', 'Rend', 'Red', 'Blue', 'Girl',
  'Time', 'Past', 'Future', 'Dev', 'Vortex', 'Paradox', 'Monkey',
  'Fly', 'Flying', 'Soar', 'Soaring', 'Power', 'Falling', 'Slice',
  'Green', 'Yellow', 'Gold', 'Demon', 'Demonic', 'Panda', 'Cat',
  'Kitty', 'Kitten', 'Zero', 'Memory', 'Trooper', 'XX', 'Bandit',
  'Fear', 'Light', 'Glow', 'Tread', 'Deep', 'Deeper', 'Deepest',
  'Mine', 'Your', 'Worst', 'Enemy', 'Hostile', 'Force', 'Video',
  'Gun', 'Assault', 'Recon', 'Trap', 'Trapper', 'Redeem', 'Code',
  'Script', 'Writer', 'Near', 'Close', 'Open', 'Circle', 'Walker',
  'Geo', 'Genome', 'Germ', 'Spaz', 'Shot', 'Echo', 'Beta', 'Alpha',
  'Gamma', 'Omega', 'Seal', 'Squid', 'Money', 'Cash', 'Lord', 'King',
  'Zombie', 'Sarge', 'Capt', 'Captain', 'Punch', 'One', 'Two', 'Uno',
  'Slash', 'Melt', 'Melted', 'Melting', 'Fell', 'Wolf', 'Hound', 'Boy',
  'Duke', 'Rest', 'Fire', 'Flame', 'Morrow', 'Break', 'Breaker', 'Numb',
  'Ice', 'Cold', 'Rotten', 'Sick', 'Sickly', 'Janitor', 'Camel', 'Colt',
  'Elevator', 'Wrench', 'Grease', 'Head', 'Theme', 'Grand', 'Cool', 'Kid',
  'Sad', 'Happy', 'Joy', 'Joyful', 'Crimson', 'Destiny', 'Deceit', 'Lies',
  'Smasher', 'Extreme', 'Multi', 'Universe', 'Ultimate', 'Death', 'Ready',
  'Sand', 'Desert', 'Dessert', 'Hurdle', 'Racer', 'Eraser', 'Erase', 'Big',
  'Small', 'Short', 'Tall', 'Sith', 'Bounty', 'Hunter', 'Cracked', 'Broken',
  'Lie', 'Honest', 'Destined', 'Bloxxer', 'Hawk', 'Eagle', 'Hawker', 'Cube',
  'Legacy', 'Sharp', 'Dead', 'Mew', 'Chuckle', 'Bubba', 'Bubble', 'Sandwich',
]; 

let nickName = '';
const randName = () => {
  nickName = nameList[Math.floor(Math.random() * 100)];
  nickName += nameList[Math.floor(Math.random() * 100)];
  return nickName;
};

const messagesList = document.getElementById('messages-list')
const chatMessages = document.querySelector('.chat-messages');
const userList = document.getElementById('users');

const client = window.io();

document.getElementById('send-burtton').addEventListener('click', (e) => {
  e.preventDefault();
  const chatMessage = document.getElementById('message').value;
  console.log('chatMessage: ', chatMessage)
  const nickname = localStorage.getItem('nickname');
  client.emit('message', { chatMessage, nickname });
  document.getElementById('message').value = ''
  document.getElementById('message').focus();
});

document.getElementById('nick-btn').addEventListener('click', (e) => {
  e.preventDefault();
  const nickname = document.getElementById('nick').value
  client.emit('changNickname', nickname);
  document.getElementById('nick').value = '';
  document.getElementById('nick').value.focus();
});

function outputMessage(message2) {
  const li = document.createElement('li');
  li.classList.add('meta');
  li.innerText = message2
  li.setAttribute('data-testid', 'message');
  messagesList.appendChild(li);
}

function outputUsers(users) {
  userList.innerHTML = '';
  // Solução para ordem de exibição - Rapahael Caputo - T07
  const userFound = users.findIndex((user) => user.id === client.id);
  const userFoundRemoved = users.splice(userFound, 1);
  users.unshift(userFoundRemoved[0]);
  //
  const activeUser = users.filter((user) => user.id === client.id)
  localStorage.setItem('nickname', activeUser[0].nickname);
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.nickname;
    li.setAttribute('data-testid', 'online-user');
    userList.appendChild(li);
  });
}

client.on('connect', () => {
  const user = `${randName()}_${String(client.id)}`;
  client.emit('joinRoom', user.slice(0, 16));
});

client.on('onlineUsers', (users) => {
  outputUsers(users);
});

client.on('message', (message1) => {
  outputMessage(message1);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
