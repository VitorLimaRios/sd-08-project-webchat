module.exports = (modelData) => {
  const { timestamp: ts, nickname, message } = modelData;
  const dateTime = ts.toLocaleString('pt-br').replace(/\//g, '-');
  return `${dateTime} ${nickname} ${message}`;
};
