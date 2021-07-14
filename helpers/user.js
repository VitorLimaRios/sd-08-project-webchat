const crypto = require('crypto');

module.exports = {
    generateNickname: () => crypto.randomBytes(16).toString('hex'),
};