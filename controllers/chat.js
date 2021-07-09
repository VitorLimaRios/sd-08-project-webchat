const crypto = require('crypto');

module.exports = (_req, res) => {
const randomId = crypto.randomBytes(8).toString('hex');

  res.render('chat', { name: randomId });
};