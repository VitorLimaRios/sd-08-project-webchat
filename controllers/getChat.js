const Service = require('../services').Messages;
const utils = require('../utils');

module.exports = async (_req, res) => {
  try {
    const { result } = await Service.findAll();
    const messages = result.map(utils.buildChatMessage);
    res.status(200).render('index', { messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};