const chat = async (__req, res) => {
  res.status(200).render('chat/chat');
};

module.exports = {
  chat,
};
