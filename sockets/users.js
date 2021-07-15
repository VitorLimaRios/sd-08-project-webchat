const connectedUsers = [];

const removingUser = (socketId) => {
  const user = connectedUsers.find(({ id }) => id === socketId);
  const index = connectedUsers.indexOf(user);
  connectedUsers.splice(index, 1);
};

const addUser = (id, userName) => {
  connectedUsers.push({ id, userName });
};

const updateUser = (oldName, newName) => {
  const user = connectedUsers.find(({ userName }) => userName === oldName);
  const index = connectedUsers.indexOf(user);
  const newUser = { id: user.id, userName: newName };
  connectedUsers.splice(index, 1, newUser);
  return connectedUsers;
};

const getAll = () => connectedUsers;

module.exports = {
  removingUser,
  addUser,
  getAll,
  updateUser,
};
