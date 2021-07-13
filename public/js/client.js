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

const message = document.getElementById('message');
const chatMessages = document.querySelector('.chat-messages');
const userList = document.getElementById('users');
const nick = document.getElementById('nick');

const client = window.io();

message.addEventListener('change', (e) => {
e.preventDefault();
const chatMessage = e.target.value;
const user = `${randName()}_${String(client.id)}`;
client.emit('message', { chatMessage, nickname: user, });
e.target.value = '';
e.target.focus();
});

nick.addEventListener('change', (e) => {
  e.preventDefault();
  const nickname = e.target.value;
  client.emit('changNickname', nickname);
  e.target.value = '';
  e.target.focus();
});

function outputMessage(message2) {
const div = document.createElement('div');
div.classList.add('message');
const img = document.createElement('img');
img.setAttribute('src', 'https://i.pravatar.cc/50');
img.setAttribute('class', 'avatar');
div.appendChild(img);
const p = document.createElement('p');
p.classList.add('meta');
p.innerHTML = `<span data-testid="message">${message2}<span>`;
div.appendChild(p);
document.querySelector('.chat-messages').appendChild(div);
}

function outputUsers(users) {
userList.innerHTML = '';
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
