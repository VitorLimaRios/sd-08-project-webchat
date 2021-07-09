// Faça seu código aqui
const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);

const PORT = 3002;
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

http.listen(PORT, () => console.log(`Servidor aberto na porta ${PORT}.`));
