const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

app.use(cors());
app.set('view engine', 'ejs');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
/* 
app.get("/", async (req, res) => {
  res.render("chat")
}) */

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

/* io.on("connection", (socket) => {
  console.log("usuario conectado")
  socket.on("message", (data) => {
    //pesquisa do banco
    io.emit("message", data)
  })
}) */

const currentData = () => {
  let today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  const hour = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();
  today = `${month}-${day}-${year} ${hour}:${minutes}:${seconds}`;

  return today;
};

const messageSocket = (socket) => {
  socket.on('message', async (message) => {
    const timestamp = currentData();
    /* await model.newMessage({ ...message, timestamp }); */
    io.emit('message', `${timestamp}-${message.nickname}: ${message.chatMessage}`);
  });
};

/* const changeName = (socket) => {
  socket.on('changeName', (newName) => {
    const result = connectedUsers.findIndex((user) => user.id === socket.id.substr(0, 16));
    connectedUsers[result] = { id: socket.id.substr(0, 16), name: newName };
    socket.emit('changeName', newName);
    io.emit('updateUsers', connectedUsers);
  });
}; */

io.on('connection', async (socket) => {
  console.log('CONECTADO');
  /* connectedUsers.unshift({ id: socket.id.substr(0, 16), name: '' }); */

  /*   const messages = await model.getAllMessages(); */

  /*   io.emit('loadHistory', messages);
  
    io.emit('updateUsers', connectedUsers); */

  messageSocket(socket);

  /*   changeName(socket); */

  /*   socket.on('disconnect', () => {
      const result = connectedUsers.find((user) => user.id === socket.id);
      connectedUsers.splice(result, 1);
      io.emit('updateUsers', connectedUsers);
    }); */
});

const PORT = 3000;

http.listen(PORT, () => console.log('RODANDO'));