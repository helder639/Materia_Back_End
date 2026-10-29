const express = require('express');
const sequelize = require('./config/db');
const pessoasRoutes = require('./models/pessoas');

const app = express();

app.use(express.json());
app.use('/pessoas', pessoasRoutes);

const PORT = 3000;

sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        return sequelize.sync();
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor executando em http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Não foi possível conectar ao banco de dados:', err);
    });