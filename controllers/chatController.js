exports.chat = (req, res) => {
  try {
    res.status(200).render('chat', {
      title: 'Project WebChat', 
      message: 'SOCKET.IO - WEBCHAT', 
    });
  } catch (err) {
    res.status(400).json({ statusCode: 'bad request', error: err.message });
  }
};
