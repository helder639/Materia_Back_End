const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res)=>{
    res.send('Página inicial');
})

app.get('/adicao', (req,res)=>{
    res.send('Você está na rota adição');
})
//ADIÇÃO DOS DOIS JEITOS
app.get('/adicao/:a/:b', (req,res)=>{
    const a = req.params.a;
    const b = req.params.b;

    res.json({
        resultado: parseInt(a) + parseInt(b)
    })

})

app.post('/adicao', (req,res)=>{
    const a = req.body.a;
    const b = req.body.b;
    res.json({
        resultado: parseInt(a) + parseInt(b)
    })
})

//SUBTRAÇÃO
app.get('/subtracao', (req,res)=>{
    res.send('Você está na rota subtração');
})

app.post('/subtracao', (req,res)=>{
    const a = req.body.a;
    const b = req.body.b;
    res.json({
        resultado: parseInt(a) - parseInt(b)
    })
})

//MULTIPLICAÇÃO
app.get('/multiplicacao', (req,res)=>{
    res.send('Você está na rota multiplicação');
})

app.post('/multiplicacao', (req,res)=>{
    const a = req.body.a;
    const b = req.body.b;
    res.json({
        resultado: parseInt(a) * parseInt(b)
    })
})

//DIVISÃO
app.get('/divisao', (req,res)=>{
    res.send('Você está na rota divisão');
})

app.post('/divisao', (req,res)=>{
    const a = req.body.a;
    const b = req.body.b;
    res.json({
        resultado: parseInt(a) / parseInt(b)
    })
})

app.listen(3000, () => {
  console.log('Servidor Express executando http://localhost:3000');
});

