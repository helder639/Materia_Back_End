const crypto = require('crypto');

function avancarMes(data, meses) {
<<<<<<< HEAD

  const [ano, mes, dia] = data.split('-').map(Number);

  const base = new Date(ano, mes - 1 + meses, 1);

  const ultimoDia = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();

  return `${base.getFullYear()}-${String(base.getMonth() + 1)
  .padStart(2, '0')}-${String(Math.min(dia, ultimoDia)).padStart(2, '0')}`;
  
}

const connection = require('../database/connection');

class Lancamento {

  listar(usuarioId, filtros, callback) {

=======
  const [ano, mes, dia] = data.split('-').map(Number);
  const base = new Date(ano, mes - 1 + meses, 1);
  const ultimoDia = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  return `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, '0')}-${String(Math.min(dia, ultimoDia)).padStart(2, '0')}`;
}
const connection = require('../database/connection');

class Lancamento {
  listar(usuarioId, filtros, callback) {
>>>>>>> main
    const {
      inicio,
      fim,
      tipo,
      categoriaId,
      fonteDestinoId,
      pagina = 1,
      limite = 20,
    } = filtros;

    let where = 'WHERE l.usuario_id = ?';
    const params = [usuarioId];

    if (inicio) {
      where += ' AND l.data >= ?';
      params.push(inicio);
    }
<<<<<<< HEAD

=======
>>>>>>> main
    if (fim) {
      where += ' AND l.data <= ?';
      params.push(fim);
    }
<<<<<<< HEAD

=======
>>>>>>> main
    if (tipo) {
      where += ' AND l.tipo = ?';
      params.push(tipo);
    }
<<<<<<< HEAD

=======
>>>>>>> main
    if (categoriaId) {
      where += ' AND l.categoria_id = ?';
      params.push(categoriaId);
    }
<<<<<<< HEAD

=======
>>>>>>> main
    if (fonteDestinoId) {
      where += ' AND l.fonte_destino_id = ?';
      params.push(fonteDestinoId);
    }

    const sqlResumo = `
      SELECT
        COUNT(*) AS totalItens,
        COALESCE(SUM(CASE WHEN l.tipo = 'entrada' THEN l.valor ELSE 0 END), 0) AS entradas,
        COALESCE(SUM(CASE WHEN l.tipo = 'saida' THEN l.valor ELSE 0 END), 0) AS saidas
      FROM lancamentos l
      ${where}
    `;

    connection.query(sqlResumo, params, (erro, resultadoResumo) => {
<<<<<<< HEAD

      if (erro) return callback(erro);

      const resumoRow = resultadoResumo[0];

      const totalItens = Number(resumoRow.totalItens);

      const entradas = Number(resumoRow.entradas);

      const saidas = Number(resumoRow.saidas);

=======
      if (erro) return callback(erro);

      const resumoRow = resultadoResumo[0];
      const totalItens = Number(resumoRow.totalItens);
      const entradas = Number(resumoRow.entradas);
      const saidas = Number(resumoRow.saidas);
>>>>>>> main
      const offset = (pagina - 1) * limite;

      const sqlItens = `
        SELECT
          l.id,
          l.tipo,
          l.descricao,
          l.valor,
          l.data,
          l.parcela_atual,
          l.total_parcelas,
          l.grupo_parcelamento,
          c.id AS categoria_id,
          c.nome AS categoria_nome,
          f.id AS fonte_destino_id,
          f.nome AS fonte_destino_nome
        FROM lancamentos l
        JOIN categorias c ON c.id = l.categoria_id
        JOIN fontes_destinos f ON f.id = l.fonte_destino_id
        ${where}
        ORDER BY l.data DESC, l.id DESC
        LIMIT ? OFFSET ?
      `;

      connection.query(sqlItens, [...params, Number(limite), Number(offset)], (erro, itens) => {
        if (erro) return callback(erro);

        callback(null, {
          totalItens,
          resumo: {
            entradas,
            saidas,
            saldo: Number((entradas - saidas).toFixed(2)),
          },
          itens,
        });
      });
    });
  }

  buscarPorId(id, usuarioId, callback) {
    const sql = `
      SELECT
        l.id,
        l.tipo,
        l.descricao,
        l.valor,
        l.data,
        l.parcela_atual,
        l.total_parcelas,
        l.grupo_parcelamento,
        c.id AS categoria_id,
        c.nome AS categoria_nome,
        f.id AS fonte_destino_id,
        f.nome AS fonte_destino_nome
      FROM lancamentos l
      JOIN categorias c ON c.id = l.categoria_id
      JOIN fontes_destinos f ON f.id = l.fonte_destino_id
      WHERE l.id = ? AND l.usuario_id = ?
    `;
    connection.query(sql, [id, usuarioId], callback);
  }

  inserir(usuarioId, { tipo, descricao, valoresParcelas, data, categoriaId, fonteDestinoId }, callback) {
<<<<<<< HEAD

    const totalParcelas = valoresParcelas.length;

=======
    const totalParcelas = valoresParcelas.length;
>>>>>>> main
    const grupoParcelamento = totalParcelas > 1 ? crypto.randomUUID() : null;

    const linhas = valoresParcelas.map((valorParcela, index) => [
      usuarioId,
      tipo,
      descricao,
      valorParcela,
      avancarMes(data, index),
      categoriaId,
      fonteDestinoId,
      index + 1,
      totalParcelas,
      grupoParcelamento,
    ]);

    connection.beginTransaction((erro) => {
<<<<<<< HEAD

=======
>>>>>>> main
      if (erro) return callback(erro);

      const sql = `
        INSERT INTO lancamentos (
          usuario_id,
          tipo,
          descricao,
          valor,
          data,
          categoria_id,
          fonte_destino_id,
          parcela_atual,
          total_parcelas,
          grupo_parcelamento
        ) VALUES ?
      `;

      connection.query(sql, [linhas], (erro, resultado) => {
<<<<<<< HEAD

=======
>>>>>>> main
        if (erro) return connection.rollback(() => callback(erro));

        connection.commit((erro) => {
          if (erro) return connection.rollback(() => callback(erro));
          callback(null, {
            primeiroId: resultado.insertId,
            totalInserido: resultado.affectedRows,
            grupoParcelamento,
          });
        });
      });
    });
  }

  atualizar(id, usuarioId, { tipo, descricao, valor, data, categoriaId, fonteDestinoId }, callback) {
<<<<<<< HEAD

=======
>>>>>>> main
    const sql = `
      UPDATE lancamentos
      SET tipo = ?, descricao = ?, valor = ?, data = ?, categoria_id = ?, fonte_destino_id = ?
      WHERE id = ? AND usuario_id = ?
    `;
<<<<<<< HEAD

    const params = [tipo, descricao, valor, data, categoriaId, fonteDestinoId, id, usuarioId];
    connection.query(sql, params, callback);

  }

  remover(id, usuarioId, todasParcelas, callback) {

    if (!todasParcelas) {

      const sql = 'DELETE FROM lancamentos WHERE id = ? AND usuario_id = ?';
      return connection.query(sql, [id, usuarioId], callback);

=======
    const params = [tipo, descricao, valor, data, categoriaId, fonteDestinoId, id, usuarioId];
    connection.query(sql, params, callback);
  }

  remover(id, usuarioId, todasParcelas, callback) {
    if (!todasParcelas) {
      const sql = 'DELETE FROM lancamentos WHERE id = ? AND usuario_id = ?';
      return connection.query(sql, [id, usuarioId], callback);
>>>>>>> main
    }

    const sqlBusca = 'SELECT grupo_parcelamento FROM lancamentos WHERE id = ? AND usuario_id = ?';
    connection.query(sqlBusca, [id, usuarioId], (erro, resultados) => {
<<<<<<< HEAD
      
      if (erro) return callback(erro);

      if (resultados.length === 0) {

        return callback(null, { affectedRows: 0 });

      }

      const { grupo_parcelamento: grupo } = resultados[0];

      if (!grupo) {

        const sqlUnico = 'DELETE FROM lancamentos WHERE id = ? AND usuario_id = ?';
        return connection.query(sqlUnico, [id, usuarioId], callback);

=======
      if (erro) return callback(erro);
      if (resultados.length === 0) {
        return callback(null, { affectedRows: 0 });
      }

      const { grupo_parcelamento: grupo } = resultados[0];
      if (!grupo) {
        const sqlUnico = 'DELETE FROM lancamentos WHERE id = ? AND usuario_id = ?';
        return connection.query(sqlUnico, [id, usuarioId], callback);
>>>>>>> main
      }

      const sqlGrupo = 'DELETE FROM lancamentos WHERE grupo_parcelamento = ? AND usuario_id = ?';
      connection.query(sqlGrupo, [grupo, usuarioId], callback);
<<<<<<< HEAD
      
=======
>>>>>>> main
    });
  }
}

module.exports = new Lancamento();