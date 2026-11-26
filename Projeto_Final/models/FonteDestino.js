const connection = require('../database/connection');

class FonteDestino {
  listar(usuarioId, tipo, callback) {

    let sql = `
      SELECT id, nome, tipo, dia_fechamento, dia_vencimento, limite
      FROM fontes_destinos
      WHERE usuario_id = ?
    `;

    const params = [usuarioId];

    if (tipo) {

      sql += ' AND tipo = ?';
      params.push(tipo);

    }

    sql += ' ORDER BY tipo, nome';
    connection.query(sql, params, callback);

  }

  buscarPorId(id, usuarioId, callback) {

    const sql = `
      SELECT id, nome, tipo, dia_fechamento, dia_vencimento, limite
      FROM fontes_destinos
      WHERE id = ? AND usuario_id = ?
    `;

    connection.query(sql, [id, usuarioId], callback);

  }

  inserir(usuarioId, { nome, tipo, dia_fechamento, dia_vencimento, limite }, callback) {

    const sql = `
      INSERT INTO fontes_destinos (usuario_id, nome, tipo, dia_fechamento, dia_vencimento, limite)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      sql,
      [usuarioId, nome, tipo, dia_fechamento, dia_vencimento, limite],
      callback
    );

  }

  atualizar(id, usuarioId, { nome, tipo, dia_fechamento, dia_vencimento, limite }, callback) {

    const sql = `
      UPDATE fontes_destinos
      SET nome = ?, tipo = ?, dia_fechamento = ?, dia_vencimento = ?, limite = ?
      WHERE id = ? AND usuario_id = ?
    `;

    connection.query(
      sql,
      [nome, tipo, dia_fechamento, dia_vencimento, limite, id, usuarioId],
      callback
    );

  }

  remover(id, usuarioId, callback) {

    const sqlCheck = 'SELECT COUNT(*) AS total FROM lancamentos WHERE fonte_destino_id = ? AND usuario_id = ?';

    connection.query(sqlCheck, [id, usuarioId], (erro, resultados) => {

      if (erro) return callback(erro);

      if (resultados[0].total > 0) {

        return callback({ code: 'HAS_LANCAMENTOS' });

      }

      const sqlDelete = 'DELETE FROM fontes_destinos WHERE id = ? AND usuario_id = ?';
      connection.query(sqlDelete, [id, usuarioId], callback);
      
    });
  }
}

module.exports = new FonteDestino();