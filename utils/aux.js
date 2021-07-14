const timestampGenerator = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const fMonth = ((month < 10) ? '0' : '') + month;
  const fHours = ((hours < 10) ? '0' : '') + hours;
  const fMinutes = ((minutes < 10) ? '0' : '') + minutes;
  const fSeconds = ((seconds < 10) ? '0' : '') + seconds;
  const dateOutput = `${day}-${fMonth}-${year} - ${fHours}:${fMinutes}:${fSeconds}`;
  return dateOutput;
};

module.exports = { timestampGenerator };
