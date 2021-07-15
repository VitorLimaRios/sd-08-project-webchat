const { getChat } = require('../services/chatUseCase')

exports.chat = async (req, res) => {
  try {
    const chat = await getChat();
    res.status(200).render('chat', {
      title: 'Project WebChat',
      subtitle: 'SOCKET.IO - WEBCHAT',
      ...chat
    });
  } catch (err) {
    res.status(400).json({statusCode: 'bad request', error: err.message});
  }
};
