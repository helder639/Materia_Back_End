USE api_financas;
-- Dados de demonstração. Senha dos dois usuários: password (bcrypt).
INSERT INTO usuarios (id,nome,email,cpf,senha_hash) VALUES
(1,'Ana Demonstração','ana.demo@example.com','52998224725','$2b$10$N9qo8uLOickgx2ZMRZoMye.IjZAgcfl7p92ldGxad68LJZdL17lhWy'),
(2,'Bruno Demonstração','bruno.demo@example.com','11144477735','$2b$10$N9qo8uLOickgx2ZMRZoMye.IjZAgcfl7p92ldGxad68LJZdL17lhWy');
INSERT INTO categorias (id,usuario_id,nome,tipo) VALUES
(1,1,'Salário','entrada'),(2,1,'Alimentação','saida'),(3,1,'Moradia','saida'),
(4,2,'Salário','entrada'),(5,2,'Lazer','saida');
INSERT INTO fontes_destinos (id,usuario_id,nome,tipo,dia_fechamento,dia_vencimento,limite) VALUES
(1,1,'Conta corrente','conta',NULL,NULL,NULL),(2,1,'Cartão principal','cartao_credito',20,28,5000),
(3,2,'Conta corrente','conta',NULL,NULL,NULL),(4,2,'Cartão Bruno','cartao_credito',15,25,3000);
INSERT INTO lancamentos (usuario_id,tipo,descricao,valor,data,categoria_id,fonte_destino_id,parcela_atual,total_parcelas,grupo_parcelamento) VALUES
(1,'entrada','Salário agosto',4500.00,'2026-08-05',1,1,1,1,NULL),
(1,'saida','Aluguel agosto',1400.00,'2026-08-10',3,1,1,1,NULL),
(1,'entrada','Salário setembro',4500.00,'2026-09-05',1,1,1,1,NULL),
(1,'saida','Compra notebook 1/3',500.00,'2026-09-18',2,2,1,3,'11111111-1111-4111-8111-111111111111'),
(1,'entrada','Salário outubro',4500.00,'2026-10-05',1,1,1,1,NULL),
(1,'saida','Compra notebook 2/3',500.00,'2026-10-18',2,2,2,3,'11111111-1111-4111-8111-111111111111'),
(1,'saida','Compra notebook 3/3',500.00,'2026-11-18',2,2,3,3,'11111111-1111-4111-8111-111111111111'),
(2,'entrada','Salário agosto',3800.00,'2026-08-05',4,3,1,1,NULL),
(2,'saida','Cinema',120.00,'2026-08-20',5,3,1,1,NULL),
(2,'entrada','Salário setembro',3800.00,'2026-09-05',4,3,1,1,NULL),
(2,'saida','Fone 1/2',250.00,'2026-09-16',5,4,1,2,'22222222-2222-4222-8222-222222222222'),
(2,'entrada','Salário outubro',3800.00,'2026-10-05',4,3,1,1,NULL),
(2,'saida','Fone 2/2',250.00,'2026-10-16',5,4,2,2,'22222222-2222-4222-8222-222222222222');
