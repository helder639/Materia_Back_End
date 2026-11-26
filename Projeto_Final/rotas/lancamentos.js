const express = require('express');

const router = express.Router();

const Lancamento = require('../models/Lancamento');

const Categoria = require('../models/Categoria');

const FonteDestino = require('../models/FonteDestino');

const { dividirEmParcelas } = require('../utils/faturas');

const TIPOS = ['entrada', 'saida'];

const dataValida = (valor) => /^\d{4}-\d{2}-\d{2}$/.test(valor || '') && !Number.isNaN(Date.parse(`${valor}T00:00:00Z`)) && new Date(`${valor}T00:00:00Z`).toISOString().slice(0, 10) === valor;

function validar(body, parcial = false) {

  const erros = {};

  const dados = {};

  const campos = ['tipo', 'descricao', 'valor', 'data', 'categoriaId', 'fonteDestinoId'];

  if (parcial && !campos.some((c) => body[c] !== undefined)) erros.dados = 'Informe ao menos um campo para atualizar.';

  const exigido = (campo) => !parcial || body[campo] !== undefined;

  if (exigido('tipo')) { if (!TIPOS.includes(body.tipo)) erros.tipo = 'Use entrada ou saida.'; else dados.tipo = body.tipo; }

  if (exigido('descricao')) { if (typeof body.descricao !== 'string' || !body.descricao.trim() || body.descricao.trim().length > 120) erros.descricao = 'Informe uma descrição de até 120 caracteres.'; else dados.descricao = body.descricao.trim(); }

  if (exigido('valor')) { const v = Number(body.valor); if (!Number.isFinite(v) || v <= 0 || Math.round(v * 100) !== v * 100) erros.valor = 'Informe um valor positivo com até duas casas decimais.'; else dados.valor = v; }

  if (exigido('data')) { if (!dataValida(body.data)) erros.data = 'Informe a data no formato AAAA-MM-DD.'; else dados.data = body.data; }

  for (const campo of ['categoriaId', 'fonteDestinoId']) if (exigido(campo)) { const n = Number(body[campo]); if (!Number.isInteger(n) || n < 1) erros[campo] = 'Informe um identificador válido.'; else dados[campo] = n; }
  
  if (body.parcelas !== undefined) { const n = Number(body.parcelas); if (!Number.isInteger(n) || n < 1 || n > 48) erros.parcelas = 'A quantidade deve estar entre 1 e 48.'; else dados.parcelas = n; }
  return { erros, dados };
}

function validarRelacionamentos(usuarioId, dados, callback) {

  const validarCategoria = (proximo) => {

    if (!dados.categoriaId) return proximo(null);

    Categoria.buscarPorId(dados.categoriaId, usuarioId, (erro, rows) => {

      if (erro) return proximo(erro);

      if (!rows.length) return proximo({ status: 400, campo: 'categoriaId',
         mensagem: 'Categoria não encontrada para este usuário.' });
      const tipo = dados.tipo;

      if (tipo && rows[0].tipo !== tipo) return proximo({ status: 400, campo: 'categoriaId',
         mensagem: 'O tipo da categoria deve ser igual ao tipo do lançamento.' });
      dados._categoriaTipo = rows[0].tipo;

      proximo(null);
    });
  };

  validarCategoria((erro) => {

    if (erro) return callback(erro);

    if (!dados.fonteDestinoId) return callback(null);

    FonteDestino.buscarPorId(dados.fonteDestinoId, usuarioId, (err, rows) => {

      if (err) return callback(err);

      if (!rows.length) return callback({ status: 400, campo: 'fonteDestinoId',
         mensagem: 'Fonte/destino não encontrada para este usuário.' });
      const tipoLancamento = dados.tipo || dados._categoriaTipo;

      if (tipoLancamento === 'entrada' && rows[0].tipo === 'cartao_credito')
         return callback({ status: 400, campo: 'fonteDestinoId',
         mensagem: 'Entradas não podem ser vinculadas a cartão de crédito.' });
      callback(null);
    });
  });
}

router.get('/', (req, res) => {

  const { inicio, fim, tipo, categoriaId, fonteDestinoId } = req.query;

  if ((inicio && !dataValida(inicio)) || (fim && !dataValida(fim)) || 
  (inicio && fim && inicio > fim)) return res.status(400)
  .json({ erro: 'Período inválido. Use inicio e fim no formato AAAA-MM-DD.' });

  if (tipo && !TIPOS.includes(tipo)) return res.status(400)
    .json({ erro: 'tipo deve ser entrada ou saida.' });

  const pagina = Number(req.query.pagina || 1);

  if (!Number.isInteger(pagina) || pagina < 1) return res.status(400)
    .json({ erro: 'pagina deve ser um inteiro positivo.' });

  Lancamento.listar(req.auth.id, { inicio, fim, tipo, categoriaId, fonteDestinoId, pagina,
     limite: 20 }, (erro, resultado) => {
    if (erro) { console.error(erro); return res.status(500)
      .json({ erro: 'Erro ao listar lançamentos.' }); }

    res.json({ pagina, porPagina: 20, ...resultado });

  });
});

router.get('/:id', (req, res) => Lancamento.buscarPorId(req.params.id, req.auth.id,
   (erro, rows) => {

  if (erro) { console.error(erro); return res.status(500)
    .json({ erro: 'Erro ao buscar lançamento.' }); }

  if (!rows.length) return res.status(404)
    .json({ erro: 'Lançamento não encontrado.' });

  res.json(rows[0]);
}));

router.post('/', (req, res) => {

  const { erros, dados } = validar(req.body);

  if (Object.keys(erros).length) return res.status(400)
    .json({ erro: 'Dados inválidos.', campos: erros });

  validarRelacionamentos(req.auth.id, dados, (erro) => {

    if (erro) { if (erro.status) return res.status(erro.status)
      .json({ erro: erro.mensagem, campos: { [erro.campo]: erro.mensagem } });
     console.error(erro); return res.status(500).json({ erro: 'Erro ao validar lançamento.' }); }

    const valores = dividirEmParcelas(dados.valor, dados.parcelas || 1);

    Lancamento.inserir(req.auth.id, { ...dados, valoresParcelas: valores },
       (err, resultado) => {

      if (err) { console.error(err); return res.status(500)
        .json({ erro: 'Erro ao criar lançamento.' }); }

      res.status(201).json(resultado);

    });
  });
});

router.put('/:id', (req, res) => {

  const { erros, dados } = validar(req.body, true);

  if (Object.keys(erros).length) return res.status(400)
    .json({ erro: 'Dados inválidos.', campos: erros });

  Lancamento.buscarPorId(req.params.id, req.auth.id, (erro, rows) => {

    if (erro) { console.error(erro); return res.status(500)
      .json({ erro: 'Erro ao buscar lançamento.' }); }

    if (!rows.length) return res.status(404)
      .json({ erro: 'Lançamento não encontrado.' });

    const antigo = rows[0];

    const combinado = { tipo: dados.tipo || antigo.tipo, categoriaId: dados.categoriaId ||
       antigo.categoria_id, fonteDestinoId: dados.fonteDestinoId || antigo.fonte_destino_id };

    validarRelacionamentos(req.auth.id, combinado, (err) => {

      if (err) { if (err.status) return res.status(err.status)
        .json({ erro: err.mensagem, campos: { [err.campo]: err.mensagem } });
       console.error(err); return res.status(500).json({ erro: 'Erro ao validar lançamento.' });
       }

      const atualizado = { tipo: combinado.tipo, descricao: dados.descricao ||
         antigo.descricao, valor: dados.valor || Number(antigo.valor),
          data: dados.data || antigo.data, categoriaId: combinado.categoriaId,
           fonteDestinoId: combinado.fonteDestinoId };

      Lancamento.atualizar(req.params.id, req.auth.id, atualizado, (e, resultado) => {

        if (e) { console.error(e);
           return res.status(500).json({ erro: 'Erro ao atualizar lançamento.' }); }

        if (!resultado.affectedRows) return res.status(404)
          .json({ erro: 'Lançamento não encontrado.' });

        res.json({ id: Number(req.params.id), ...atualizado });

      });
    });
  });
});

router.delete('/:id', (req, res) => {

  if (req.query.todasParcelas !== undefined && !['true', 'false']
    .includes(req.query.todasParcelas)) return res.status(400)
    .json({ erro: 'todasParcelas deve ser true ou false.' });

  Lancamento.remover(req.params.id, req.auth.id, req.query.todasParcelas === 'true',
     (erro, resultado) => {

    if (erro) { console.error(erro); return res.status(500)
      .json({ erro: 'Erro ao excluir lançamento.' }); }

    if (!resultado.affectedRows) return res.status(404)
      .json({ erro: 'Lançamento não encontrado.' });

    res.status(204).send();
    
  });
});
module.exports = router;
