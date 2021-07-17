const socket = window.io();
socket.on('users', (message) => console.log(message));

socket.on('logout', (message) => console.log(message));
socket.on('message', (message) => console.log(message));
socket.on('server', (message) => console.log(message));
socket.emit('message', { chatMessage: 'Olá Beto', nickname: socket.id });