const currentDateAndTime = new Date();

const addZeroToTheLeft = (num) => {
  if (num <= 9) return `0${num}`;
  return num;
};

const getDate = () => {
  const day = addZeroToTheLeft(currentDateAndTime.getDate().toString());
  const month = addZeroToTheLeft((currentDateAndTime.getMonth() + 1).toString());
  const year = addZeroToTheLeft(currentDateAndTime.getFullYear().toString());
  return `${day}-${month}-${year}`;
};

const getHour = () => {
  const hours = addZeroToTheLeft(currentDateAndTime.getHours().toString());
  const minutes = addZeroToTheLeft(currentDateAndTime.getMinutes().toString());
  const seconds = addZeroToTheLeft(currentDateAndTime.getSeconds().toString());
  return `${hours}:${minutes}:${seconds}`;
};

const getDateAndHour = () => `${getDate()} ${getHour()}`;

module.exports = {
  getDateAndHour,
};