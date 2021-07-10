function getChatHour() {
  const dataAtual = new Date();
  const dia = dataAtual.getDate();
  const mes = (dataAtual.getMonth() + 1);
  const ano = dataAtual.getFullYear();
  const horas = dataAtual.getHours();
  const minutos = dataAtual.getMinutes();
  const sec = dataAtual.getSeconds();

  return `${dia}-${mes}-${ano} ${horas}:${minutos}:${sec}`;
}

module.exports = { getChatHour };