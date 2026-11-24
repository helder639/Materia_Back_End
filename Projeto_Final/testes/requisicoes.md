# Exemplos de requisições

Use `Authorization: Bearer <token>` nas rotas protegidas. Faça login em `POST /auth/login` com `email` e `senha`.

## Lançamentos

- `GET /lancamentos?inicio=2026-08-01&fim=2026-10-31&tipo=saida&pagina=1`
- filtros opcionais: `categoriaId`, `fonteDestinoId`; página contém 20 itens e a resposta também traz resumo financeiro.
- `GET /lancamentos/1`
- `POST /lancamentos` JSON: `{"tipo":"saida","descricao":"Notebook","valor":1500,"data":"2026-09-18","categoriaId":2,"fonteDestinoId":2,"parcelas":3}`
- `PUT /lancamentos/1` JSON com os campos que deseja alterar.
- `DELETE /lancamentos/1` apaga um lançamento. `DELETE /lancamentos/1?todasParcelas=true` apaga seu grupo parcelado.

## Relatórios

- `GET /relatorios/categorias?inicio=2026-08-01&fim=2026-10-31`
- `GET /relatorios/fontes-destinos?inicio=2026-08-01&fim=2026-10-31`
- `GET /relatorios/faturas?meses=3`
- `GET /relatorios/saude-financeira`
