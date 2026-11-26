# API de Controle Financeiro

API REST em Node.js, Express e MySQL para usuários, categorias, fontes/destinos e lançamentos financeiros.

## Requisitos

- Node.js 18 ou superior
- MySQL 8

## Instalação

1. Crie o banco e tabelas executando `database/schema.sql` no MySQL.
2. Copie `.env.example` para `.env` e preencha `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` e `JWT_SECRET`.
3. Instale dependências: `npm install`.
4. Inicie em desenvolvimento com `npm run dev` ou normalmente com `npm start`.
5. Para dados demonstrativos, execute `database/seed.sql` depois do schema.

O servidor usa a porta 3000 por padrão. Cadastro/login estão em `/auth`; todas as demais rotas exigem token JWT no cabeçalho `Authorization: Bearer <token>`.

## Rotas principais

- `/categorias` e `/fontes-destinos`: cadastros de apoio.
- `/lancamentos`: operações de entrada/saída, filtros, paginação e parcelamento até 48 vezes.
- `/relatorios`: análises por categoria, fonte/destino, faturas previstas e saúde financeira.

