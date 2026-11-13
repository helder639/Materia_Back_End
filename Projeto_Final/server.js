require('dotenv').config();
const express = require('express');
const connection = require('./database/connection');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensagem: 'API de Finanças rodando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});