const app = require('express')();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET'],
  },
});

const routes = require('./src/routes');

app.set('view engine', 'ejs');
app.set('views', './src/views');

const PORT = process.env.PORT || 3000;

require('./src/sockets/server')(io);

app.use(routes);

http.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});
