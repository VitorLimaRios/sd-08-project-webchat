// FROMMM https://github.com/tryber/sd-08-live-lectures/blob/lecture/31_4/back-end/server.js
// inspirado https://socket.io/docs/v3/emit-cheatsheet/index.html

const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');

const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['POST', 'GET'],
    },
});

// Para formatação de datas peguei 
//  https://stackoverflow.com/questions/10632346/how-to-format-a-date-in-mm-dd-yyyy-hhmmss-format-in-javascript

const d = new Date();
 const dformat = `${[d.getDate(),
               d.getMonth() + 1,
               d.getFullYear()].join('-')} ${
               ((d.getHours() > 12) ? (d.getHours() - 12) : d.getHours())}:${
                [d.getMinutes(),
               d.getSeconds()].join(':')} ${(d.getHours() > 12) ? 'PM' : 'AM'}`;

// https://stackoverflow.com/questions/3954438/how-to-remove-item-from-array-by-value
// const remove = function (array, key) {
//     let what; 
//     const a = arguments; 
//     let L = a.length;
//     let ax;
//     while (L && this.length) {
//         what = a[--L];
//         while ((ax = this.indexOf(what)) !== -1) {
//             this.splice(ax, 1);
//         }
//     }
//     return this;
// };

const PORT = 3000;

app.set('view engine', 'ejs');
const listOnline = [];
app.set('views', './views');
let myId = 'Nick Não definido';
io.on('connection', (socket) => {
    listOnline.push(socket.id);
    myId = socket.id;
    console.log('a user connected', myId);
    socket.on('message', (message) => {
        console.log(dformat, `- ${message.nickname}: ${message.chatMessage}`);
        const result = `${dformat} - ${message.nickname}: ${message.chatMessage}`;
        io.emit('message', result);
      });
    socket.on('disconnect', () => {
        // listOnline.remove(socket.id);
        console.log('user disconnected');
      });
  });

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).render('index', { myId, listOnline });
  });

http.listen(PORT, () => console.log('App listening on PORT %s', PORT));