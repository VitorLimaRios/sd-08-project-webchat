const {
  chatModel: {
    readMessages,
  },
} = require('../models');

const OK = 200;
const INTERNAL_ERROR = 400;

const chatReader = async (_req, res) => {
  try {
    const messages = await readMessages();

    res.status(OK).render('client', { messages });
  } catch (error) {
    console.error(error);
    return res.status(INTERNAL_ERROR).json({ message: error.message });
  }
};

module.exports = {
  chatReader,
};