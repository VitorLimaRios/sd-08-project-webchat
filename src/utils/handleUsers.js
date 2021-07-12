let users = [];

function userJoin(id, nickname) {
  const user = { id, nickname };
  if (users) {
    users = users.filter((use) => use.id !== user.id);
  }
  users.push(user);
  return users;
}

function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

function userLeave(id) {
  users = users.filter((use) => use.id !== id);
  return users;
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
};
