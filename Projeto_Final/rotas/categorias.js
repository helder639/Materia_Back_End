const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');

// GET /categorias?tipo=saida
router.get('/', (req, res) => {
  const { tipo } = req.query;
  if (tipo && !['entrada', 'saida'].includes(tipo)) {
    return res.status(400).json({
      erro: 'Dados inválidos.',
      campos: { tipo: 'O tipo deve ser "entrada" ou "saida".' }
    });
  }

  Categoria.listar(req.auth.id, tipo, (erro, resultados) => {
    if (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao listar categorias.' });
    }
    return res.json(resultados);
  });
});

// POST /categorias
router.post('/', (req, res) => {
  const { nome, tipo } = req.body;
  const erros = {};

  if (!nome || !nome.trim()) erros.nome = 'Informe o nome da categoria.';
  if (!tipo || !['entrada', 'saida'].includes(tipo)) {
    erros.tipo = 'O tipo deve ser "entrada" ou "saida".';
  }

  if (Object.keys(erros).length > 0) {
    return res.status(400).json({ erro: 'Dados inválidos.', campos: erros });
  }

  const nomeLimpo = nome.trim();
  Categoria.inserir(req.auth.id, { nome: nomeLimpo, tipo }, (erro, resultado) => {
    if (erro && erro.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        erro: 'Categoria já cadastrada.',
        campos: { nome: 'Já existe uma categoria com este nome para este tipo.' }
      });
    }
    if (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao criar categoria.' });
    }
    return res.status(201).json({ id: resultado.insertId, nome: nomeLimpo, tipo });
  });
});

// PUT /categorias/:id
router.put('/:id', (req, res) => {
  const { nome, tipo } = req.body;
  const erros = {};

  if (!nome || !nome.trim()) erros.nome = 'Informe o nome da categoria.';
  if (!tipo || !['entrada', 'saida'].includes(tipo)) {
    erros.tipo = 'O tipo deve ser "entrada" ou "saida".';
  }

  if (Object.keys(erros).length > 0) {
    return res.status(400).json({ erro: 'Dados inválidos.', campos: erros });
  }

  const nomeLimpo = nome.trim();
  Categoria.atualizar(req.params.id, req.auth.id, { nome: nomeLimpo, tipo }, (erro, resultado) => {
    if (erro && erro.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        erro: 'Categoria já cadastrada.',
        campos: { nome: 'Já existe uma categoria com este nome para este tipo.' }
      });
    }
    if (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao atualizar categoria.' });
    }
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Categoria não encontrada.' });
    }
    return res.json({ id: Number(req.params.id), nome: nomeLimpo, tipo });
  });
});

// DELETE /categorias/:id
router.delete('/:id', (req, res) => {
  Categoria.remover(req.params.id, req.auth.id, (erro, resultado) => {
    if (erro && erro.code === 'HAS_LANCAMENTOS') {
      return res.status(409).json({
        erro: 'Não é possível excluir esta categoria pois existem lançamentos vinculados a ela.'
      });
    }
    if (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao excluir categoria.' });
    }
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Categoria não encontrada.' });
    }
    return res.status(204).send();
  });
});

module.exports = router;