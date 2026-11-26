const connection = require('../database/connection');

const { calcularFatura } = require('../utils/faturas');

const asDate = (s) => new Date(`${s}T00:00:00Z`);

class Relatorio {

  categorias(usuarioId, inicio, fim, callback) {
    const dias=Math.round((asDate(fim)-asDate(inicio))/86400000)+1;

    const antFim=new Date(asDate(inicio).getTime()-86400000), antIni=new Date(antFim.getTime()-(dias-1)*86400000);

    const fmt=(d)=>d.toISOString().slice(0,10);

    const sql=`SELECT c.id categoriaId,c.nome categoria,l.tipo,

      SUM(CASE WHEN l.data BETWEEN ? AND ? THEN l.valor ELSE 0 END) totalAnterior,

      SUM(CASE WHEN l.data BETWEEN ? AND ? THEN l.valor ELSE 0 END) totalAtual

      FROM lancamentos l JOIN categorias c ON c.id=l.categoria_id WHERE l.usuario_id=? AND l.data BETWEEN ? AND ? GROUP BY c.id,c.nome,l.tipo ORDER BY l.tipo,c.nome`;

    connection.query(sql,[fmt(antIni),fmt(antFim),inicio,fim,usuarioId,fmt(antIni),fim],(err,rows)=>{

      if(err)return callback(err);
        const resultado=rows.map(r=>({categoriaId:r.categoriaId,categoria:r.categoria,tipo:r.tipo,total:Number(r.totalAtual),totalPeriodoAnterior:Number(r.totalAnterior),percentual:0}));
        for(const item of resultado){const soma=resultado.filter(x=>x.tipo===item.tipo).reduce((s,x)=>s+x.total,0);item.percentual=soma?Number((item.total/soma*100).toFixed(2)):0;}
          callback(null,resultado);
    });
  }
  fontesDestinos(usuarioId,inicio,fim,callback){
      const sql=`SELECT f.id,f.nome,f.tipo,COALESCE(SUM(CASE WHEN l.tipo='entrada' THEN l.valor ELSE 0 END),0) entradas,COALESCE(SUM(CASE WHEN l.tipo='saida' THEN l.valor ELSE 0 END),0) saidas,COALESCE(SUM(CASE WHEN l.tipo='entrada' THEN l.valor ELSE -l.valor END),0) saldo FROM fontes_destinos f LEFT JOIN lancamentos l ON l.fonte_destino_id=f.id AND l.usuario_id=f.usuario_id AND l.data BETWEEN ? AND ? WHERE f.usuario_id=? GROUP BY f.id,f.nome,f.tipo ORDER BY f.nome`;
      connection.query(sql,[inicio,fim,usuarioId],(e,rows)=>e?callback(e):callback(null,rows.map(r=>({...r,entradas:Number(r.entradas),saidas:Number(r.saidas),saldo:Number(r.saldo)}))));
  }
  faturas(usuarioId,meses,callback){
      const sql=`SELECT f.id cartaoId,f.nome,f.limite,f.dia_fechamento,f.dia_vencimento,l.id,l.descricao,l.valor,l.data,l.parcela_atual,l.total_parcelas FROM fontes_destinos f LEFT JOIN lancamentos l ON l.fonte_destino_id=f.id AND l.usuario_id=f.usuario_id AND l.tipo='saida' WHERE f.usuario_id=? AND f.tipo='cartao_credito' ORDER BY f.id,l.data,l.id`;
      connection.query(sql,[usuarioId],(err,rows)=>{
        if(err)return callback(err);const cards=new Map();
        for(const r of rows){if(!cards.has(r.cartaoId))cards.set(r.cartaoId,{cartaoId:r.cartaoId,nome:r.nome,limiteTotal:Number(r.limite),limiteComprometido:0,faturas:[]});const c=cards.get(r.cartaoId);if(!r.id)continue;
          const valor=Number(r.valor);

          const f=calcularFatura(r.data,r.dia_fechamento,r.dia_vencimento);

          const hoje=new Date();hoje.setHours(0,0,0,0);const agora=new Date(hoje.getFullYear(),hoje.getMonth(),1);const limite=new Date(agora.getFullYear(),agora.getMonth()+meses,1);

          const venc=new Date(`${f.vencimento}T00:00:00`);

        if(venc>=hoje)c.limiteComprometido+=valor;
        
        if(venc>=agora&&venc<limite){
          let bucket=c.faturas.find(x=>x.mes===f.vencimento.slice(0,7));if(!bucket){bucket={mes:f.vencimento.slice(0,7),fechamento:f.fechamento,vencimento:f.vencimento,total:0,itens:[]};c.faturas.push(bucket);}
          bucket.total+=valor;bucket.itens.push({lancamentoId:r.id,descricao:r.descricao,valor,parcela:`${r.parcela_atual}/${r.total_parcelas}`});
        }
      }
      callback(null,[...cards.values()].map(c=>({...c,limiteComprometido:Number(c.limiteComprometido.toFixed(2)),limiteDisponivel:Number(Math.max(0,c.limiteTotal-c.limiteComprometido).toFixed(2)),faturas:c.faturas.sort((a,b)=>a.mes.localeCompare(b.mes))})));
    });
  }
  saude(usuarioId,callback){
    const sql=`SELECT COALESCE(SUM(CASE WHEN tipo='entrada' THEN valor ELSE 0 END),0) entradas,COALESCE(SUM(CASE WHEN tipo='saida' THEN valor ELSE 0 END),0) saidas FROM lancamentos WHERE usuario_id=? AND data>=DATE_SUB(CURDATE(),INTERVAL 3 MONTH) AND data<=CURDATE()`;
    connection.query(sql,[usuarioId],(e,rows)=>{if(e)return callback(e);const entradas=Number(rows[0].entradas),saidas=Number(rows[0].saidas),saldo=entradas-saidas;
      const cartoes=`SELECT COALESCE(SUM(l.valor),0) total FROM lancamentos l JOIN fontes_destinos f ON f.id=l.fonte_destino_id WHERE l.usuario_id=? AND f.tipo='cartao_credito' AND l.tipo='saida' AND l.data>=DATE_SUB(CURDATE(),INTERVAL 3 MONTH) AND l.data<=CURDATE()`;
      connection.query(cartoes,[usuarioId],(err,r)=>{if(err)return callback(err);const media=saidas/3;callback(null,{periodoMeses:3,entradas,saidas,taxaPoupanca:entradas?Number((saldo/entradas*100).toFixed(2)):0,comprometimentoCartoes:entradas?Number((Number(r[0].total)/entradas*100).toFixed(2)):0,mesesReserva:media?Number((Math.max(0,saldo)/media).toFixed(2)):0,projecaoProximoMes:Number(saldo.toFixed(2)),dicas:['Revise seus gastos por categoria.','Procure manter uma reserva para emergências.'],aviso:'Estimativa educativa baseada nos lançamentos cadastrados; não constitui aconselhamento financeiro.'});});
    });
  }
}
module.exports=new Relatorio();
