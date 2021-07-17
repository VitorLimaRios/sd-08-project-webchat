// Faça seu código aqui
require('dotenv').config();
const express = require('express');

const app = express();
const http = require('http').createServer(app);

const { PORT = 3000 } = process.env;
http.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}`));