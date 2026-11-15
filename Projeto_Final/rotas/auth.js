const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { cpfValido } = require('../utils/cpf');
const protegerRota = require('../middleware/auth');

const router = express.Router();

// RF1 — Cadastro de usuário
router.post('/cadastro', async (req, res) => {
  const { nome, email, cpf, senha } = req.body;
  const erros = {};

  if (!nome || !nome.trim()) erros.nome = 'Informe o nome.';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) erros.email = 'E-mail inválido.';
  if (!cpf || !cpfValido(cpf)) erros.cpf = 'CPF inválido.';
  if (!senha || senha.length < 8 || !/[A-Za-z]/.test(senha) || !/\d/.test(senha)) {
    erros.senha = 'A senha deve ter ao menos 8 caracteres, com letras e números.';
  }

  if (Object.keys(erros).length > 0) {
    return res.status(400).json({ erro: 'Dados inválidos.', campos: erros });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const dados = {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      cpf: cpf.replace(/\D/g, ''),
      senhaHash
    };

    Usuario.cadastrar(dados, (erro, usuario) => {
      if (erro && erro.code === 'ER_DUP_ENTRY') {
        const campo = erro.sqlMessage.includes('uq_usuarios_cpf') ? 'cpf' : 'email';
        return res.status(409).json({
          erro: 'Usuário já cadastrado.',
          campos: { [campo]: `Já existe um usuário com este ${campo === 'cpf' ? 'CPF' : 'e-mail'}.` }
        });
      }
      if (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
      }
      return res.status(201).json(usuario);
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro interno ao processar senha.' });
  }
});

// RF2 — Login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({
      erro: 'Dados inválidos.',
      campos: {
        ...(!email && { email: 'Informe o e-mail.' }),
        ...(!senha && { senha: 'Informe a senha.' })
      }
    });
  }

  const emailNorm = email.trim().toLowerCase();
  Usuario.buscarPorEmail(emailNorm, async (erro, resultados) => {
    if (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro interno ao realizar login.' });
    }
    if (resultados.length === 0) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const usuario = resultados[0];
    const confere = await bcrypt.compare(senha, usuario.senha_hash);
    if (!confere) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    });
  });
});

// RF2 — Perfil do usuário autenticado
router.get('/me', protegerRota, (req, res) => {
  Usuario.buscarPorId(req.auth.id, (erro, resultados) => {
    if (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao buscar dados do usuário.' });
    }
    if (resultados.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    return res.json(resultados[0]);
  });
});

module.exports = router;