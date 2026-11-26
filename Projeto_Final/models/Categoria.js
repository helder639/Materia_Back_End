const connection = require('../database/connection');

class Categoria {

  listar(usuarioId, tipo, callback) {

    let sql = 'SELECT id, nome, tipo FROM categorias WHERE usuario_id = ?';

    const params = [usuarioId];

    if (tipo) {

      sql += ' AND tipo = ?';
      params.push(tipo);
    }

    sql += ' ORDER BY tipo, nome';
    connection.query(sql, params, callback);

  }

  buscarPorId(id, usuarioId, callback) {

    const sql = 'SELECT id, nome, tipo FROM categorias WHERE id = ? AND usuario_id = ?';
    connection.query(sql, [id, usuarioId], callback);

  }

  inserir(usuarioId, { nome, tipo }, callback) {

    const sql = 'INSERT INTO categorias (usuario_id, nome, tipo) VALUES (?, ?, ?)';
    connection.query(sql, [usuarioId, nome, tipo], callback);

  }

  atualizar(id, usuarioId, { nome, tipo }, callback) {

    const sql = 'UPDATE categorias SET nome = ?, tipo = ? WHERE id = ? AND usuario_id = ?';
    connection.query(sql, [nome, tipo, id, usuarioId], callback);

  }

  remover(id, usuarioId, callback) {

    const sqlCheck = 'SELECT COUNT(*) AS total FROM lancamentos WHERE categoria_id = ? AND usuario_id = ?';

    connection.query(sqlCheck, [id, usuarioId], (erro, resultados) => {

      if (erro) return callback(erro);

      if (resultados[0].total > 0) {

        return callback({ code: 'HAS_LANCAMENTOS' });

      }

      const sqlDelete = 'DELETE FROM categorias WHERE id = ? AND usuario_id = ?';
      
      connection.query(sqlDelete, [id, usuarioId], callback);

    });
  }
}

module.exports = new Categoria();