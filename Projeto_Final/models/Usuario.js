const connection = require('../database/connection');

const CATEGORIAS_PADRAO = [
  ['Salário', 'entrada'], ['Outras entradas', 'entrada'],
  ['Alimentação', 'saida'], ['Moradia', 'saida'], ['Saúde', 'saida'],
  ['Mobilidade', 'saida'], ['Lazer', 'saida'], ['Educação', 'saida'], ['Outras saídas', 'saida'],
];

class Usuario {

  cadastrar({ nome, email, cpf, senhaHash }, callback) {

    connection.beginTransaction((erro) => {

      if (erro) return callback(erro);

      const sqlUsuario = 'INSERT INTO usuarios (nome, email, cpf, senha_hash) VALUES (?, ?, ?, ?)';

      connection.query(sqlUsuario, [nome, email, cpf, senhaHash], (erro, resultado) => {

        if (erro) return connection.rollback(() => callback(erro));

        const usuarioId = resultado.insertId;

        const linhas = CATEGORIAS_PADRAO.map(([nomeCat, tipo]) => [usuarioId, nomeCat, tipo]);

        connection.query('INSERT INTO categorias (usuario_id, nome, tipo) VALUES ?', [linhas], (erro) => {

          if (erro) return connection.rollback(() => callback(erro));

          const sqlFonte = "INSERT INTO fontes_destinos (usuario_id, nome, tipo) VALUES (?, 'Conta corrente', 'conta')";

          connection.query(sqlFonte, [usuarioId], (erro) => {

            if (erro) return connection.rollback(() => callback(erro));

            connection.commit((erro) => {

              if (erro) return connection.rollback(() => callback(erro));

              callback(null, { id: usuarioId, nome, email });

            });
          });
        });
      });
    });
  }

  buscarPorEmail(email, callback) {

    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    connection.query(sql, [email], callback);

  }

  buscarPorId(id, callback) {

    const sql = 'SELECT id, nome, email, cpf, criado_em FROM usuarios WHERE id = ?';
    connection.query(sql, [id], callback);
    
  }
}

module.exports = new Usuario();