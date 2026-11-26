const express = require('express');

const router = express.Router();

const FonteDestino = require('../models/FonteDestino');

const TIPOS_VALIDOS = ['renda', 'conta', 'cartao_credito'];

function validarDadosFonte(body) {

  const { nome, tipo, dia_fechamento, dia_vencimento, limite } = body;
  const erros = {};

  if (!nome || !nome.trim()) {

    erros.nome = 'Informe o nome da fonte ou destino.';

  }

  if (!tipo || !TIPOS_VALIDOS.includes(tipo)) {

    erros.tipo = 'O tipo deve ser "renda", "conta" ou "cartao_credito".';

  }

  const dadosLimpos = {

    nome: nome ? nome.trim() : '',
    tipo,
    dia_fechamento: null,
    dia_vencimento: null,
    limite: null

  };

  if (tipo === 'cartao_credito') {

    const fechamento = Number(dia_fechamento);
    const vencimento = Number(dia_vencimento);
    const limiteNum = Number(limite);

    if (!Number.isInteger(fechamento) || fechamento < 1 || fechamento > 31) {

      erros.dia_fechamento = 'Informe um dia de fechamento válido entre 1 e 31.';
    }

    if (!Number.isInteger(vencimento) || vencimento < 1 || vencimento > 31) {

      erros.dia_vencimento = 'Informe um dia de vencimento válido entre 1 e 31.';

    }
    if (limite === undefined || limite === null || isNaN(limiteNum) || limiteNum <= 0) {

      erros.limite = 'Informe um limite positivo para o cartão de crédito.';

    }

    dadosLimpos.dia_fechamento = fechamento;
    dadosLimpos.dia_vencimento = vencimento;
    dadosLimpos.limite = limiteNum;

  }

  return { erros, dadosLimpos };
}

router.get('/', (req, res) => {

  const { tipo } = req.query;

  if (tipo && !TIPOS_VALIDOS.includes(tipo)) {

    return res.status(400).json({
      erro: 'Dados inválidos.',
      campos: { tipo: 'O tipo deve ser "renda", "conta" ou "cartao_credito".' }
    });

  }

  FonteDestino.listar(req.auth.id, tipo, (erro, resultados) => {

    if (erro) {

      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao listar fontes e destinos.' });

    }

    return res.json(resultados);

  });
});


router.post('/', (req, res) => {

  const { erros, dadosLimpos } = validarDadosFonte(req.body);

  if (Object.keys(erros).length > 0) {

    return res.status(400).json({ erro: 'Dados inválidos.', campos: erros });

  }

  FonteDestino.inserir(req.auth.id, dadosLimpos, (erro, resultado) => {

    if (erro && erro.code === 'ER_DUP_ENTRY') {

      return res.status(409).json({
        erro: 'Fonte ou destino já cadastrado.',
        campos: { nome: 'Já existe uma fonte ou destino com este nome.' }
      });

    }
    if (erro) {

      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao cadastrar fonte ou destino.' });

    }

    return res.status(201).json({ id: resultado.insertId, ...dadosLimpos });

  });
});


router.put('/:id', (req, res) => {

  const { erros, dadosLimpos } = validarDadosFonte(req.body);

  if (Object.keys(erros).length > 0) {

    return res.status(400).json({ erro: 'Dados inválidos.', campos: erros });

  }

  FonteDestino.atualizar(req.params.id, req.auth.id, dadosLimpos, (erro, resultado) => {

    if (erro && erro.code === 'ER_DUP_ENTRY') {

      return res.status(409).json({
        erro: 'Fonte ou destino já cadastrado.',
        campos: { nome: 'Já existe uma fonte ou destino com este nome.' }
      });

    }
    if (erro) {

      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao atualizar fonte ou destino.' });

    }

    if (resultado.affectedRows === 0) {

      return res.status(404).json({ erro: 'Fonte ou destino não encontrado.' });

    }

    return res.json({ id: Number(req.params.id), ...dadosLimpos });

  });
});

router.delete('/:id', (req, res) => {

  FonteDestino.remover(req.params.id, req.auth.id, (erro, resultado) => {

    if (erro && erro.code === 'HAS_LANCAMENTOS') {

      return res.status(409).json({
        erro: 'Não é possível excluir esta fonte/destino pois existem lançamentos vinculados a ela.'
      });

    }
    if (erro) {

      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao excluir fonte ou destino.' });

    }
    if (resultado.affectedRows === 0) {

      return res.status(404).json({ erro: 'Fonte ou destino não encontrado.' });

    }

    return res.status(204).send();
    
  });
});

module.exports = router;