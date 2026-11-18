require('dotenv').config();
const express = require('express');
require('./database/connection');
const protegerRota = require('./middleware/auth');

const app = express();
app.use(express.json());

app.use('/auth', require('./rotas/auth'));

app.use('/categorias', protegerRota, require('./rotas/categorias'));
app.use('/fontes-destinos', protegerRota, require('./rotas/fontesDestinos'));

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

app.use((erro, req, res, next) => {
  if (erro.name === 'UnauthorizedError') {
    return res.status(401).json({ erro: 'Token ausente, inválido ou expirado.' });
  }
  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));