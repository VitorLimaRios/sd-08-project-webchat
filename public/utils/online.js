const onlineList = [];

const onlineAdd = (name) => {
  onlineList.push(name);
};

const onlineRemove = (name) => {
  onlineList.splice(onlineList.indexOf(name), 1);
};

const getList = () => onlineList;

module.exports = { onlineAdd, onlineRemove, getList };