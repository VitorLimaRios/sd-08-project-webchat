const getRandomIntInclusive = (min, max) =>
  Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);

const getRandomCharacter = () => {
  const characterList = 'abcdefghijklmnopqrstuvywz';
  const randomNumber = getRandomIntInclusive(0, 25);

  return characterList.substring(randomNumber, randomNumber + 1);
};

const compliteRandomName = (nickname) => {
  let result = nickname;
  for (let i = nickname.length; i <= 16; i += 1) {
    result += getRandomCharacter();
  }
  return result;
};

const getRandomNickname = (socketId) => {
  let nickname = '';
  if (socketId && socketId.length > 16) {
    nickname = socketId.substring(0, 16);
  }

  if (socketId && socketId.length < 16) {
    nickname = compliteRandomName(socketId);
  }

  return nickname;
};

module.exports = { getRandomNickname };
