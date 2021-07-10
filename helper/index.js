// Para formatação de datas peguei 
//  https://stackoverflow.com/questions/10632346/how-to-format-a-date-in-mm-dd-yyyy-hhmmss-format-in-javascript
const dformat = (d) => `${[d.getDate(),
    d.getMonth() + 1,
    d.getFullYear()].join('-')} ${
    ((d.getHours() > 12) ? (d.getHours() - 12) : d.getHours())}:${
    [d.getMinutes(),
    d.getSeconds()].join(':')} ${(d.getHours() > 12) ? 'PM' : 'AM'}`;

const removeArray = (array, value) => {
    const index = array.indexOf(value);
    array.slice(index);
    return array;
};

const findIndex = (array, id) => {
    const index = array.findIndex((xablau) => xablau.id === id);
    return index;
};

module.exports = {
    dformat,
    removeArray,
    findIndex,
  };