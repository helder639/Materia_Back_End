<<<<<<< HEAD
const express=require('express');

const router=express.Router();

const Relatorio=require('../models/Relatorio');

const dataValida = v=>/^\d{4}-\d{2}-\d{2}$/.test(v || '') &&
 !Number.isNaN(Date.parse(`${v}T00:00:00Z`)) && 
 new Date(`${v}T00:00:00Z`).toISOString().slice(0,10)===v;

function periodo(req,res,next){const {inicio,fim} = req.query;

if(!dataValida(inicio) || !dataValida(fim) || inicio>fim)
    return res.status(400).json({erro:'Informe inicio e fim válidos no formato AAAA-MM-DD.'});
    next();}

router.get('/categorias',periodo,(req,res) => 
    Relatorio.categorias(req.auth.id,req.query.inicio,req.query.fim,
        (e,d)=>e?(console.error(e),res.status(500)
        .json({erro:'Erro ao gerar relatório por categorias.'})):res.json(d)));

router.get('/fontes-destinos',periodo,(req,res)=>
    Relatorio.fontesDestinos(req.auth.id,req.query.inicio,req.query.fim,
        (e,d)=>e?(console.error(e),res.status(500)
        .json({erro:'Erro ao gerar relatório de fontes e destinos.'})):res.json(d)));

router.get('/faturas',(req,res)=>
    {const meses=Number(req.query.meses||1);
        if(!Number.isInteger(meses)||meses<1||meses>12)
            return res.status(400).json({erro:'meses deve ser um inteiro entre 1 e 12.'});
        Relatorio.faturas(req.auth.id,meses,(e,d)=>e?(console.error(e),res.status(500).
        json({erro:'Erro ao prever faturas.'})):res.json(d));});

router.get('/saude-financeira',(req,res)=>
    Relatorio.saude(req.auth.id,(e,d)=>e?(console.error(e),res.status(500)
    .json({erro:'Erro ao calcular saúde financeira.'})):res.json(d)));
=======
const express=require('express');const router=express.Router();const Relatorio=require('../models/Relatorio');
const dataValida=v=>/^\d{4}-\d{2}-\d{2}$/.test(v||'')&&!Number.isNaN(Date.parse(`${v}T00:00:00Z`))&&new Date(`${v}T00:00:00Z`).toISOString().slice(0,10)===v;
function periodo(req,res,next){const {inicio,fim}=req.query;if(!dataValida(inicio)||!dataValida(fim)||inicio>fim)return res.status(400).json({erro:'Informe inicio e fim válidos no formato AAAA-MM-DD.'});next();}
router.get('/categorias',periodo,(req,res)=>Relatorio.categorias(req.auth.id,req.query.inicio,req.query.fim,(e,d)=>e?(console.error(e),res.status(500).json({erro:'Erro ao gerar relatório por categorias.'})):res.json(d)));
router.get('/fontes-destinos',periodo,(req,res)=>Relatorio.fontesDestinos(req.auth.id,req.query.inicio,req.query.fim,(e,d)=>e?(console.error(e),res.status(500).json({erro:'Erro ao gerar relatório de fontes e destinos.'})):res.json(d)));
router.get('/faturas',(req,res)=>{const meses=Number(req.query.meses||1);if(!Number.isInteger(meses)||meses<1||meses>12)return res.status(400).json({erro:'meses deve ser um inteiro entre 1 e 12.'});Relatorio.faturas(req.auth.id,meses,(e,d)=>e?(console.error(e),res.status(500).json({erro:'Erro ao prever faturas.'})):res.json(d));});
router.get('/saude-financeira',(req,res)=>Relatorio.saude(req.auth.id,(e,d)=>e?(console.error(e),res.status(500).json({erro:'Erro ao calcular saúde financeira.'})):res.json(d)));
>>>>>>> main
module.exports=router;
