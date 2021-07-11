const socket = io();

const form = document.querySelector('form');
const nickname = document.querySelector('#nickname');
const chat = document.querySelector('#mensagem');


form.addEventListener('submit', (event) => {
    event.preventDefault();
    socket.emit('message', {nickname: nickname.value, chatMessage: chat.value}); 
    nickname = "";
    chatMessage = "";
    return false;
}) 


const createMessage = async(nickname, chatMessage, data) => {
    const chat = document.querySelector('#chat');
    const li = document.createElement('li');
    li.innerText = `${data} PM - ${nickname}: ${chatMessage}`;
    chat.appendChild(li);
}


socket.on('entrar', async(message) => createMessage(message));  //aguardando o evento 'message' do server.js

socket.on('serverMessage', async({nickname, chatMessage, data}) => createMessage(nickname, chatMessage, data));

// const nameRandom = () => {
//     var result           = '';
//     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     var charactersLength = characters.length;
//     for ( var i = 0; i < 16; i++ ) {
//         result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return result;
// }

// const saveLocalStorage = (name) => {
//   localStorage.setItem('nome', JSON.stringify(name));    
// } 
// saveLocalStorage(nameRandom())

// const nome = JSON.parse(localStorage.getItem('nome'));
// socket.emit('nome', {nome}); 