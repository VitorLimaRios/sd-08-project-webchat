const express = require('express');

const app = express();
const http = require('http').createServer(app);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/public`));

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'], 
  },
});

const Routes = require('./routes');

app.use('/', Routes.chat);

require('./sockets/index')(io);

const PORT = 3000;
http.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}`));