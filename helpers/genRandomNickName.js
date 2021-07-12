const genRandomNickName = () => {
  let nickName = '';
  const randomString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 16; i += 1) {
    nickName += randomString.charAt(Math.floor(Math.random() * randomString.length));
  }
  return nickName;
};

module.exports = {
  genRandomNickName,
};