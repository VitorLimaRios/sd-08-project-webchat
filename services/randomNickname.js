function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}

function getRandomCharacter() {
  const characterList = 'abcdefghijklmnopqrstuvywz';
  const randomNumber = getRandomIntInclusive(0, 25);

  return characterList.substring(randomNumber, randomNumber + 1);
}

function getRandomNickname() {
  let nickname = '';

  for (let i = 1; i <= 16; i += 1) {
    if (i === 1) { nickname = getRandomCharacter(); }
    nickname += getRandomCharacter();
  }

  return nickname;
}

module.exports = { getRandomNickname };
