function addZero(numero) {
    if (numero <= 9) return `0${numero}`;
    return numero;
}

const formatDate = (date) => {
  const day = addZero(date.getDate().toString());
  const month = addZero(date.getMonth() + 1).toString();
  const year = date.getFullYear();
  const hour = addZero(date.getHours().toString());
  const minute = addZero(date.getMinutes().toString());
  const second = addZero(date.getSeconds().toString());

  return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
};

module.exports = {
  formatDate,
};
