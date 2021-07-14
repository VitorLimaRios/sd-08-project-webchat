const { get } = require('../models/message');

exports.chat = async (req, res) => {
  try {
    const messageChanel = await get();
    console.log(messageChanel);
    
    res.status(200).render('chat', {
      title: 'Project WebChat', 
      subtitle: 'SOCKET.IO - WEBCHAT',
      messageChanel,
    });
  } catch (err) {
    res.status(400).json({ statusCode: 'bad request', error: err.message });
  }
};
