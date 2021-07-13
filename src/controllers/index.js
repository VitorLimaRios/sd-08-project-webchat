const { getAll } = require('../models/messages');
const chatRoon = async (__req, res, __next) => {
  const allMessages = await getAll();
    return res.status(200).render('index', { allMessages });
};

module.exports = {
  chatRoon,
};
