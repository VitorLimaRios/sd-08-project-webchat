const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    method: ['GET', 'POST'],
  },
});

require('./sockets/Chat')(io);

app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

http.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
