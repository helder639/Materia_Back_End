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
    for(let n of usuario.compras){
        total += n;
    }
    usuario.total = total;
    console.log(`${usuario.nome}: total = ${total}`);
});

//ativos

usuarios.forEach(usuario =>{
    if(usuario.ativo === true){
        console.log(`${usuario.nome}`);
    }
})

//maiores de idade

usuarios.forEach(usuario => {
    if(usuario.idade >= 18){
        console.log(`${usuario.nome}`);
    }
})

let maior = 0;
let usuarioMaior;
for(let n of usuarios){
    if(n.total > maior){
        maior = n.total;
        usuarioMaior = n;
    }
};
console.log(`Usuário com maior volume: ${usuarioMaior.nome} \n Total: ${maior}`);
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

//Desafio 7

const gerarRelatorio = (u) => {
    const totalUsuarios = u.length;
    const usuariosAtivos = u.filter(usuario => usuario.ativo).length;
    const usuariosInat = totalUsuarios - usuariosAtivos;
    const somaIdade = u.reduce((soma, usuario) => soma + usuario.idade, 0);
    const mediaIdade = somaIdade / totalUsuarios;
    let maiorVol = -1;
    let maiorComprador = "";
    
    u.forEach(usuario => {
        const totalCompras = usuario.compras.reduce((acc, valor) => acc + valor, 0);
        if(totalCompras > maiorVol) {
            maiorVol = totalCompras;
            maiorComprador = usuario.nome;
        }
    });
    return {
        totalUsuarios,
        usuariosAtivos,
        usuariosInat,
        mediaIdade,
        maiorComprador
    };
};

const relatorio = gerarRelatorio(usuarios);
console.log(relatorio);

const usuJov = (u) => {
    let menor = Infinity;
    let usuJovem = "";
    u.forEach(usuario =>{
        if(usuario.idade < menor){
            menor = usuario.idade;
            usuJovem = usuario.nome;
        }
    })
    return usuJovem;
};

console.log(`Usuário mais jovem: ${usuJov(usuarios)}`);

const usuVel = (u) => {
    let velho = -1;
    let usuVe = "";
    u.forEach(usuario => {
        if(usuario.idade > velho){
            velho = usuario.idade;
            usuVe = usuario.nome;
        }
    });
    return usuVe;
}
console.log(`Usuário mais velho: ${usuVel(usuarios)}`); 

const mediaCompras = (u) => {
    u.forEach(usuario =>{
        let soma = usuario.compras.reduce((acc, valorrr) => acc + valorrr, 0);
        let media = usuario.compras.length > 0 ? soma / usuario.compras.length : 0;
        console.log(`Média de compras de ${usuario.nome}: ${media}`);
    });
}

console.log(mediaCompras(usuarios));