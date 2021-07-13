const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

require('./sockets/chat')(io);

const chatRouter = require('./routes/chatRouter');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(`${__dirname}/public`));

app.use(chatRouter);
app.use((err, _req, res, _next) => {
  const { status, message } = err;
  res.status(status).json({
    message,
  });
});

http.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}`));