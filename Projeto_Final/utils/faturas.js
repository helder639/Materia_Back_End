function dividirEmParcelas(valorTotal, quantidade) {
<<<<<<< HEAD

  if (!Number.isFinite(Number(valorTotal)) || Number(valorTotal) <= 0 || 
  !Number.isInteger(Number(quantidade)) || quantidade < 1 || quantidade > 48) 
  throw new Error('Valor ou quantidade de parcelas inválidos.');

  const centavos = Math.round(Number(valorTotal) * 100);

  const base = Math.floor(centavos / quantidade);

  const resto = centavos % quantidade;

  return Array.from({ length: quantidade }, (_, i) => (base + (i < resto ? 1 : 0)) / 100);

}

function dataComDia(ano, mesIndex, dia) {

  const ultimoDia = new Date(ano, mesIndex + 1, 0).getDate();
  return new Date(ano, mesIndex, Math.min(dia, ultimoDia));

}

function calcularFatura(dataCompra, diaFechamento, diaVencimento) {

  const compra = new Date(`${dataCompra}T00:00:00`);

  if (Number.isNaN(compra.getTime()) || !Number.isInteger(Number(diaFechamento)) ||
   diaFechamento < 1 || diaFechamento > 31 || !Number.isInteger(Number(diaVencimento)) ||
    diaVencimento < 1 || diaVencimento > 31) throw new Error('Data ou dias do cartão inválidos.');

  let fechamento = dataComDia(compra.getFullYear(), compra.getMonth(), Number(diaFechamento));

  if (compra > fechamento) fechamento = dataComDia(compra.getFullYear(),
   compra.getMonth() + 1, Number(diaFechamento));

  let vencimento = dataComDia(fechamento.getFullYear(), fechamento.getMonth(),
   Number(diaVencimento));

  if (vencimento <= fechamento) vencimento = dataComDia(fechamento.getFullYear(),
   fechamento.getMonth() + 1, Number(diaVencimento));

  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1)
    .padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  return { fechamento: iso(fechamento), vencimento: iso(vencimento) };

=======
  if (!Number.isFinite(Number(valorTotal)) || Number(valorTotal) <= 0 || !Number.isInteger(Number(quantidade)) || quantidade < 1 || quantidade > 48) throw new Error('Valor ou quantidade de parcelas inválidos.');
  const centavos = Math.round(Number(valorTotal) * 100);
  const base = Math.floor(centavos / quantidade);
  const resto = centavos % quantidade;
  return Array.from({ length: quantidade }, (_, i) => (base + (i < resto ? 1 : 0)) / 100);
}

function dataComDia(ano, mesIndex, dia) {
  const ultimoDia = new Date(ano, mesIndex + 1, 0).getDate();
  return new Date(ano, mesIndex, Math.min(dia, ultimoDia));
}

// A compra entra na fatura que fecha no próprio dia ou no próximo fechamento.
function calcularFatura(dataCompra, diaFechamento, diaVencimento) {
  const compra = new Date(`${dataCompra}T00:00:00`);
  if (Number.isNaN(compra.getTime()) || !Number.isInteger(Number(diaFechamento)) || diaFechamento < 1 || diaFechamento > 31 || !Number.isInteger(Number(diaVencimento)) || diaVencimento < 1 || diaVencimento > 31) throw new Error('Data ou dias do cartão inválidos.');
  let fechamento = dataComDia(compra.getFullYear(), compra.getMonth(), Number(diaFechamento));
  if (compra > fechamento) fechamento = dataComDia(compra.getFullYear(), compra.getMonth() + 1, Number(diaFechamento));
  let vencimento = dataComDia(fechamento.getFullYear(), fechamento.getMonth(), Number(diaVencimento));
  if (vencimento <= fechamento) vencimento = dataComDia(fechamento.getFullYear(), fechamento.getMonth() + 1, Number(diaVencimento));
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { fechamento: iso(fechamento), vencimento: iso(vencimento) };
>>>>>>> main
}
module.exports = { dividirEmParcelas, calcularFatura };
