const http = require('node:http');

const fs = require('node:fs');

function lerArquivoJson(nomeArquivo) {
    const conteudo = fs.readFileSync(nomeArquivo, 'utf-8');
    return JSON.parse(conteudo);
}

const callback = (req, res) => {

  const url = new URL (`http://localhost:3000${req.url}`);
  const rota = url.pathname;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  try {
        if(rota === '/'){
            res.statusCode = 200;
            res.end('Você acessou a rota /')
        } else if(rota === '/carro'){
            res.statusCode = 200;
            res.end('Você acessou a rota /carro')

        }else if(rota === '/carro/classicos'){
            const dados = lerArquivoJson('classicos.json');
            res.statusCode = 200;
            res.end(JSON.stringify(dados))

        }else if(rota === '/carro/esportivo'){
            const dados = lerArquivoJson('esportivo.json')
            res.statusCode = 200;
            res.end(JSON.stringify(dados))

        }else if(rota === '/carro/luxo'){
            const dados = lerArquivoJson('luxo.json')
            res.statusCode = 200;
            res.end(JSON.stringify(dados))
        }
        else{
            res.statusCode = 404;
            res.end('Rota inválida!!!');
        }
    } catch(erro){
        res.statusCode = 500
        res.end(JSON.stringify({erro: "Erro ao ler arquivo"}));
    }
};

const server = http.createServer(callback);

server.listen(3000, () => {
  console.log('Servidor executando em http://localhost:3000');
});