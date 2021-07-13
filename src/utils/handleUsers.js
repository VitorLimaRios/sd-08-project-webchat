const users = [];

function userJoin(id, nickname) {
  const user = { id, nickname };

  users.push(user);

  return user;
}
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0].nickname;
  }
}

function getOnlineUsers() {
  return users;
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getOnlineUsers,
};
