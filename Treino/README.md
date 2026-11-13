## Resolução dos Treinos — Seção 13.3

### Treino 1 — Códigos de status e regras gerais

1. `POST /categorias` com nome já existente para o mesmo tipo → **`409` (Conflict)**
2. `PUT /fontes-destinos/12` com `tipo: "poupanca"` (formato/valor inválido) → **`400` (Bad Request)**
3. `GET /relatorios/categorias` sem `inicio` e `fim` (campos obrigatórios ausentes) → **`400` (Bad Request)**
4. `POST /auth/login` com a senha errada → **`401` (Unauthorized)**
5. `GET /rota-que-nao-existe` → **`404` (Not Found)** (formato `JSON`)
6. `POST /lancamentos` válido → **`201` (Created)**

---

### Treino 2 — Caça ao bug

**1. Trechos com erro:**
* Linha 3: `` `DELETE FROM fontes_destinos WHERE id = ${req.params.id} AND usuario_id = ${req.auth.id}` ``
* Linhas 2–4: Chamada direta a `db.query(...)` dentro de `routes/fontesDestinos.js`.
* Linha 6: `res.status(404).json({ erro: 'Fonte/destino não encontrada.' });` (sem `return`).

**2. Regras do projeto violadas:**
* **Segurança (SQL Injection):** SQL montado com *template string* em vez de parâmetros `?` (erro principal).
* **Arquitetura (Organização):** SQL escrito diretamente em `routes/` em vez de estar isolado em `models/`.
* **Fluxo HTTP:** Falta de `return` após enviar a resposta de erro `404`, fazendo a execução continuar e tentar enviar uma segunda resposta (`204`).

**3. Correção:**

```javascript
// models/FonteDestino.js
class FonteDestino {
  static async excluir(db, id, usuarioId) {
    const [resultado] = await db.query(
      'DELETE FROM fontes_destinos WHERE id = ? AND usuario_id = ?',
      [id, usuarioId]
    );
    return resultado.affectedRows > 0;
  }
}

module.exports = FonteDestino;
```

```javascript
// routes/fontesDestinos.js
router.delete('/:id', async (req, res) => {
  const excluiu = await FonteDestino.excluir(db, req.params.id, req.auth.id);

  if (!excluiu) {
    return res.status(404).json({ erro: 'Fonte/destino não encontrada.' });
  }

  return res.status(204).end();
});
```

---

### Treino 3 — Divisão das parcelas em centavos (RF6)

* **Cálculo:** R$ 250,00 = `25000` centavos divididos por `7` = base de `3571` centavos (R$ 35,71) com resto de `3` centavos somados na 1ª parcela.
* **Parcelas:** `[35.74, 35.71, 35.71, 35.71, 35.71, 35.71, 35.71]`
* **Conferência:** `R$ 35,74 + (6 × R$ 35,71) = R$ 35,74 + R$ 214,26 = R$ 250,00` (exatos).

---

### Treino 4 — Faturas do cartão (Fechamento dia 18 / Vencimento dia 3)

Compra de **R$ 250,00** em **2×** no dia **18/08/2026**:

| Parcela | Valor | Fechamento | Vencimento | Referência | Por quê |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **1/2** | R$ 125,00 | 18/09/2026 | 03/10/2026 | `2026-10` | Compra no dia do fechamento (18 ≥ 18) → fecha no mês seguinte; dia 3 < 18 → vence no mês seguinte ao fechamento |
| **2/2** | R$ 125,00 | 18/10/2026 | 03/11/2026 | `2026-11` | 1 mês após a primeira parcela |

---

### Treino 5 — Faturas do cartão com ajuste de fevereiro (Fechamento dia 31 / Vencimento dia 8)

Compra de **R$ 120,00** em **2×** no dia **31/01/2026**:

| Parcela | Valor | Fechamento | Vencimento | Referência | Por quê |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **1/2** | R$ 60,00 | 28/02/2026 | 08/03/2026 | `2026-03` | Compra no dia do fechamento (31 ≥ 31) → vai para fevereiro (dia 31 ajustado para 28/02/2026); dia 8 < 28 → vence em março |
| **2/2** | R$ 60,00 | 31/03/2026 | 08/04/2026 | `2026-04` | 1 mês após a primeira parcela (março volta ao dia 31; dia 8 < 31 → vence em abril) |

---

### Treino 6 — Aposta final (Condição de corrida e `UNIQUE`)

Duas requisições simultâneas podem executar o `SELECT` antes que qualquer uma conclua o `INSERT`, fazendo ambas passarem na validação e gerando duplicidade (condição de corrida). A restrição `UNIQUE` no banco garante a atomicidade da regra rejeitando a segunda gravação com o erro `ER_DUP_ENTRY`, que a API captura e converte em `409 Conflict`.
