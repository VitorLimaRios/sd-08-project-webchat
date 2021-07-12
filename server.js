const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');

const app = express();
const http = require('http').createServer(app);
require('dotenv/config');

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    method: ['GET', 'POST'],
  },
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());

require('./sockets')(io);
const chatController = require('./controllers/chatController');

// app.use(express.static(`${__dirname}/public`));

app.get('/', chatController.getAllMessages);

http.listen(PORT, () => {
  console.log(`Ouvindo na porta ${PORT}`);
});

module.exports = { io };
