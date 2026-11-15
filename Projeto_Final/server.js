require('dotenv').config();
const express = require('express');
require('./database/connection');

const app = express();
app.use(express.json());

// Rotas de autenticação (cadastro, login e /me)
app.use('/auth', require('./rotas/auth'));

// Rota não encontrada (404)
app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

// Tratamento global de erros (4 parâmetros)
app.use((erro, req, res, next) => {
  if (erro.name === 'UnauthorizedError') {
    return res.status(401).json({ erro: 'Token ausente, inválido ou expirado.' });
  }
  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));