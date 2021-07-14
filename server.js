const express = require('express');
const path = require('path');
const http = require('http');
const cors = require('cors');
require('dotenv').config();
const io = require('socket.io');
const events = require('./events');

const app = express();
const server = http.createServer(app);
const ioServer = io(server);

const socketList = [];

ioServer.on('connection', async (socket) => {
  events.nickname(ioServer, socket, socketList);
  events.message(ioServer, socket);
});
 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());

app.use('/styles', express.static(path.resolve(__dirname, 'styles')));
app.use('/clientScripts', express.static(path.resolve(__dirname, 'clientScripts')));
app.use('/node_modules', express.static(path.resolve(__dirname, 'node_modules')));

app.get('/', (_req, res) => {
  res.status(200).render('index');
});

const PORT = process.env.PORT || 3000;
 
server.listen(PORT, () => {
  console.log('Server running on port: ', PORT);
});