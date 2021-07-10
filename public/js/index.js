const socket = window.io();
console.log(Object.entries(socket));
console.log(socket);

socket.emit('loggedInUser', { id: 'Logged!!!' });
