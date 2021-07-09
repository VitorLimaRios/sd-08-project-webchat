function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}

function getRandomCharacter() {
  const listaLetras = 'ABCDEFGHIJKLMNOPQRSTUVYWXZ';
  const numeroAleatorio = getRandomIntInclusive(0, 25);

  return listaLetras.substring(numeroAleatorio, numeroAleatorio + 1);
}

function getRandomNickname() {
  let nome = '';

  for (let contadorLetra = 1; contadorLetra <= 16; contadorLetra += 1) {
    nome += getRandomCharacter();
  }

  return nome;
}

module.exports = { getRandomNickname };
