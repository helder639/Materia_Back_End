const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'api_financas',
  dateStrings: true
});

connection.connect((erro) => {
  if (erro) {
    console.error('Erro ao conectar no MySQL:', erro);
    return;
  }
  console.log('Conectado ao banco de dados MySQL.');
});

module.exports = connection;