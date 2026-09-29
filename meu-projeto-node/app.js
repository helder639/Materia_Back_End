const express = require('express');
const lodash = require('lodash');
const rotasOperacoes = require('./operacoes');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', rotasOperacoes);

console.log("8 + 4 =", 8 + 4);
console.log("15 - 7 =", 15 - 7);
console.log("6 * 3 =", 6 * 3);
console.log("20 / 5 =", 20 / 5);
console.log("10 / 0 =", 10 / 0);

const na = lodash.random(1, 30);
console.log("\n--- Número Aleatório ---");
console.log(`Número aleatório entre 1 e 30 gerado pelo Lodash: ${na}`);

app.listen(3000, () => {
  console.log('Servidor Express executando http://localhost:3000');
});