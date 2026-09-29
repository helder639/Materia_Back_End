const express = require('express');

const router = express.Router();
const app = express();

router.get('/', (req,res)=>{
    res.send('Página inicial');
})

router.get('/adicao', (req,res)=>{
    res.send('Você está na rota adição');
})
//ADIÇÃO DOS DOIS JEITOS
router.get('/adicao/:a/:b', (req,res)=>{
    const a = req.params.a;
    const b = req.params.b;

    res.json({
        resultado: parseInt(a) + parseInt(b)
    })

})

router.post('/adicao', (req,res)=>{
    const a = req.body.a;
    const b = req.body.b;
    res.json({
        resultado: parseInt(a) + parseInt(b)
    })
})

//SUBTRAÇÃO
router.get('/subtracao', (req,res)=>{
    res.send('Você está na rota subtração');
})

router.post('/subtracao', (req,res)=>{
    const a = req.body.a;
    const b = req.body.b;
    res.json({
        resultado: parseInt(a) - parseInt(b)
    })
})

//MULTIPLICAÇÃO
router.get('/multiplicacao', (req,res)=>{
    res.send('Você está na rota multiplicação');
})

router.post('/multiplicacao', (req,res)=>{
    const a = req.body.a;
    const b = req.body.b;
    res.json({
        resultado: parseInt(a) * parseInt(b)
    })
})

//DIVISÃO
router.get('/divisao', (req,res)=>{
    res.send('Você está na rota divisão');
})

router.post('/divisao', (req,res)=>{
    const a = req.body.a;
    const b = req.body.b;

    if (parseInt(b) === 0){
        return res.json({ resultado: 'ERRO: Divisão por zero'});
    }
    res.json({
        resultado: parseInt(a) / parseInt(b)
    })
})

/*app.listen(3000, () => {
  console.log('Servidor Express executando http://localhost:3000');
});*/

module.exports = router;
