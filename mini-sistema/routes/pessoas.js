const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Pessoa = require('../models/Pessoa');

router.post('/', async (req, res) => {
    try {
        const { nome, idade, descricao } = req.body;
        
        const novaPessoa = await Pessoa.create({ nome, idade, descricao });
        
        return res.status(201).json({
            mensagem: 'Pessoa inserida com sucesso',
            pessoa: novaPessoa
        });
    } catch (erro) {
        console.error("Erro no POST /pessoas:", erro);
        return res.status(500).json({ erro: 'Erro ao inserir pessoa' });
    }
});

router.get('/', async (req, res) => {
    try {
        const { nome, idadeMin, page = 1, limit = 10, ordem = 'ASC' } = req.query;
        
        const where = {};
        
        if (nome) {
            where.nome = {
                [Op.iLike]: `%${nome}%`
            };
        }

        if (idadeMin) {
            where.idade = {
                [Op.gte]: Number(idadeMin)
            };
        }

        const limitNum = parseInt(limit, 10);
        const pageNum = parseInt(page, 10);
        const offset = (pageNum - 1) * limitNum;

        const ordemDirecao = ordem.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        const pessoas = await Pessoa.findAndCountAll({
            where,
            limit: limitNum,
            offset: offset,
            order: [['nome', ordemDirecao]]
        });

        return res.json({
            total: pessoas.count,
            totalPages: Math.ceil(pessoas.count / limitNum),
            currentPage: pageNum,
            data: pessoas.rows
        });
    } catch (erro) {
        console.error("Erro no GET /pessoas:", erro);
        return res.status(500).json({ erro: 'Erro ao buscar pessoas' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pessoa = await Pessoa.findByPk(id);

        if (!pessoa) {
            return res.status(404).json({ erro: 'Pessoa não encontrada' });
        }

        return res.json(pessoa);
    } catch (erro) {
        console.error("Erro no GET /pessoas/:id:", erro);
        return res.status(500).json({ erro: 'Erro ao buscar pessoa' });
    }
});

module.exports = router;