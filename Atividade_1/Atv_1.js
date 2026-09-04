const usuarios = [
 { nome: "Ana", idade: 20, ativo: true, compras: [100, 50, 25]
},
 { nome: "Bruno", idade: 17, ativo: false, compras: [30, 20] },
 { nome: "Carlos", idade: 32, ativo: true, compras: [200, 150,
50, 100] },
 { nome: "Diana", idade: 25, ativo: true, compras: [] },
 { nome: "Eduardo", idade: 15, ativo: false, compras: [10] }
];

usuarios.forEach(usuario =>{
    let total = 0;
    for (let n of usuario.compras){
        total += n;
    }
    usuario.total = total;
    console.log(`${usuario.nome}: total = ${total}`);
});

const usuariosAtivos = usuarios.map(usuario =>{
    if(usuario.ativo ===true){
        console.log(`${usuario.nome}`)
    }
});

const maioresDeIdade = usuarios.map(usuario => {
    if(usuario.idade >= 18){
        console.log(`${usuario.nome}`)
    }
});

const maiorCompra = (lista) => {
    let maior = 0;
    let usuMaior = "";
    for(let n of lista){
        if(n.total > maior){
            maior = n.total 
            usuMaior = n.nome
        }
    }
    console.log(`Usuário com maior volume: ${usuMaior} \n Total: ${maior}`);
}

maiorCompra(usuarios);

const gerarRelatorio = (lista) => {

    const totalUsuarios = lista.length;
    const usuariosAtivos = lista.filter(usuario => usuario.ativo === true).length;
    const mediaIdade = (lista) => {
        let somaIdade = 0;
        let media = 0;
        for(let n of lista){
            somaIdade += n.idade;
        }
        media = somaIdade / lista.length;
        return media;   
    }

    const maiorComprador = (lista) => {
        let maior = 0;
        let usuarioMaior ="";
        for(let n of lista){
            if(n.total > maior){
                maior = n.total;
                usuarioMaior = n.nome;
            }
        }
        return usuarioMaior;
    }

    let relatiorio = {
        totalUsuarios,
        usuariosAtivos,
        mediaIdade: mediaIdade(lista),
        maiorComprador: maiorComprador(lista)
    }
    return relatiorio;
}

console.log(gerarRelatorio(usuarios));

 
const mediaCompras = (lista) => {
    for (let n of lista) {
        if (n.compras.length === 0) {
            console.log(`Média de compras de ${n.nome}: 0`);
            continue;
        }
        let somaCompras = n.total;
        let media = somaCompras / n.compras.length;
        
        console.log(`Média de compras de ${n.nome}: ${media}`);
    }
};

mediaCompras(usuarios);

/*
DESAFIO 05
R: 1 - "52" O operador + com uma string faz concatenação (junta os valores), transformando o 2 em texto.
2 - "3" O operador - exige matemática, então o JavaScript converte a string "5" para o número 5 e subtrai.
3 -  "2" O booleano true é convertido em número, valendo 1. Logo, 1 + 1 = 2. 
4 - "true" O operador == (igualdade solta) converte tipos diferentes; false vira 0, tornando a comparação verdadeira.
5 - "false" O operador === (igualdade estrita) exige que o tipo e o valor sejam iguais. Como um é booleano e o outro é número, o resultado é falso.
*/

//Desafio 6
const pessoa1 ={
 nome: "Maria",
 falar: function(){
 console.log(this.nome);
 }
};
pessoa1.falar();
//R: Maria

const pessoa2 = {
 nome: "Maria",
 falar: () => {
 console.log(this.nome);
 }
};
pessoa2.falar(); 
//R: undefined

/*
1 - O primeiro código funciona
2 - O segundo código não funciona, pois a função arrow não tem o seu próprio this, então ele vai buscar o this no escopo global, que não tem a propriedade nome.
3 - Ela não cria seu próprio contexto de this. Portanto, quando usada dentro de um objeto literal, o this não aponta para o objeto, mas sim para o escopo global (ou módulo) que envolve o objeto.
*/