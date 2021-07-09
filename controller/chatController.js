const formatMessage = ({ chatMessage, nickname }) => {
  const rawDate = new Date();
  const [date, time] = rawDate.toLocaleString().split(', ');
  const [day, month, year] = date.split('/');
  const formatedDay = day.length === 1 ? 0 + day : day;
  const formatedMonth = month.length === 1 ? 0 + month : month;
  const formatedDate = `${formatedDay}-${formatedMonth}-${year} ${time}`;
  return `${formatedDate} - ${nickname}: ${chatMessage}`;
};

module.exports = {
  formatMessage,
};