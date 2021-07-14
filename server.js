const express = require('express');

const app = express();
const htpp = require('htpp').createServer(app);
const cors = require('cors');
const PORT = 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000/',
    method: ['GET', 'POST'],
  },
});

app.use(cors());

http.listen(PORT, () => {
  console.log(`Servidor rodando na ${PORT}`);
})