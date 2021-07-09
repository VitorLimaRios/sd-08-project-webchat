const chat = require('express').Router();

chat.get('/', (_req, res) => { res.render('chat', {}); });

module.exports = chat;
