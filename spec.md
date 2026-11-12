# Nexo — Especificação do Sistema

## Estado da especificação
Esta especificação registra o MVP planejado e o estado observado em 12/11/2026. A implementação está na branch `main`; a branch `rebuild/nexo-mvp` foi preservada como trilha de reconstrução. Os itens abaixo distinguem funcionalidades implementadas, verificações realizadas e testes ainda não executados.

## 1. Objetivo
Marketplace web de descoberta de produtos digitais de pequenos criadores e vendedores independentes, para compradores que procuram produtos específicos ou de nicho.

## 2. Perfis
- **Visitante:** consulta catálogo público de produtos aprovados, pesquisa e filtra.
- **COMPRADOR:** cadastra-se, entra, consulta produtos, registra compra simulada, consulta o próprio histórico e denuncia produtos.
- **VENDEDOR:** cadastra, consulta e edita apenas seus produtos; acompanha status e envia denúncias.
- **ADMIN:** modera produtos e denúncias. Não pode ser criado por cadastro público.

## 3. Requisitos funcionais
- RF01 Cadastro com nome, e-mail, senha e papel público permitido.
- RF02 Login e logout com sessão segura.
- RF03 Autorização no servidor por papel e propriedade do registro.
- RF04 Vendedor cadastra produto com nome, descrição, categoria, nicho e preço positivo; status inicial PENDENTE.
- RF05 Vendedor consulta/edita somente produtos próprios; edição de produto aprovado retorna a PENDENTE.
- RF06 ADMIN aprova ou rejeita produtos.
- RF07 Catálogo público mostra somente produtos APROVADO.
- RF08 Pesquisa por nome/descrição.
- RF09 Filtros por categoria, nicho e faixa de preço.
- RF10 Detalhes mostram nome, descrição, categoria, nicho, preço e nome público do vendedor.
- RF11 Comprador registra compra simulada de produto aprovado, com preço no momento do registro; sem pagamento real.
- RF12 Comprador consulta somente seu histórico.
- RF13 Comprador ou vendedor registra denúncia com motivo e descrição.
- RF14 ADMIN consulta e atualiza status de denúncias.

## 4. Requisitos não funcionais
- Senhas gerenciadas pela biblioteca de autenticação Better Auth.
- Validação de entrada no servidor.
- Prisma ORM para acesso ao banco.
- Segredos apenas em variáveis de ambiente.
- Verificação de sessão, papel e propriedade no servidor.
- Cookies de sessão seguros em produção.
- Erros sem stack trace, SQL ou segredos.
- HTTPS e interface responsiva.
- Persistência real em PostgreSQL.

## 5. Modelo de dados observado no Neon
Consultas SQL somente de leitura executadas em 12/11/2026 na branch `production`, schema `public`:
- Tabelas: `account`, `product`, `purchase`, `report`, `session`, `user`, `verification`.
- `Role`: ADMIN, COMPRADOR, VENDEDOR.
- `ProductStatus`: APROVADO, PENDENTE, REJEITADO.
- `PurchaseStatus`: SIMULADA.
- `ReportStatus`: ABERTA, EM_ANALISE, RESOLVIDA.
- Chaves estrangeiras e regras observadas: account.userId -> user.id (ON DELETE CASCADE, ON UPDATE CASCADE); session.userId -> user.id (CASCADE/CASCADE); product.sellerId -> user.id (RESTRICT/CASCADE); purchase.buyerId -> user.id (RESTRICT/CASCADE); purchase.productId -> product.id (RESTRICT/CASCADE); report.reporterId -> user.id (RESTRICT/CASCADE); report.productId -> product.id (RESTRICT/CASCADE).
- Índices: PKs nas sete tabelas; unique user.email e session.token; product(status, category), product(status, niche), purchase(buyerId), report(status).
- A tabela `report` não possui coluna `updatedAt`.
- As tabelas físicas são minúsculas. Os modelos Prisma Product, Purchase e Report usam `@@map` para corresponder a `product`, `purchase` e `report`.
- Índices do Prisma foram ajustados para representar os índices existentes, sem declarar índices extras não observados.

## 6. Limites do MVP
Sem pagamentos reais, repasses, entrega automática de arquivos, chat, avaliações, afiliados, recomendação por IA ou aplicativo nativo. A compra é somente demonstrativa.

## 7. Critérios de aceite
- AC01 cadastro persiste e impede e-mail duplicado e papel ADMIN público.
- AC02 login/logout funcional.
- AC03 acesso não autorizado negado no servidor.
- AC04 vendedor cria produto PENDENTE.
- AC05 vendedor só vê/edita produtos próprios.
- AC06 ADMIN aprova/rejeita.
- AC07 catálogo exibe apenas aprovados.
- AC08 pesquisa retorna correspondências aprovadas.
- AC09 filtros combinados funcionam.
- AC10 detalhes não expõem dados privados.
- AC11 compra simulada persiste preço, comprador, produto e status.
- AC12 histórico é restrito ao comprador autenticado.
- AC13 denúncia persiste com status ABERTA.
- AC14 ADMIN modera denúncias.
- AC15 build, testes e desempenho básico verificados antes da entrega.

## 8. Stack e implantação
Next.js App Router, TypeScript, PostgreSQL/Neon, Prisma, Better Auth, Git/GitHub e Vercel. Variáveis: DATABASE_URL, DIRECT_URL, BETTER_AUTH_SECRET e BETTER_AUTH_URL. Nunca versionar credenciais reais.

Aplicação publicada em: https://nexo-marketplace-7pjz.vercel.app

## 9. Segurança e banco
Não aplicar migrations destrutivas, reset ou db push no banco Neon existente. Conferir schema com introspecção controlada e backup antes de qualquer migration. Nenhuma migration foi aplicada durante a inspeção do banco.

## 10. Estado real e validação em 12/11/2026

### Implementado no código
- Cadastro por e-mail e senha, login e logout com Better Auth.
- Papel inicial COMPRADOR; ativação do papel VENDEDOR pelo próprio comprador; papel ADMIN somente por promoção manual no Neon.
- Autorização no servidor para as rotas de comprador, vendedor e administrador.
- Cadastro, listagem e edição de produtos próprios pelo vendedor; alterações reenviam o produto para PENDENTE.
- Catálogo público com pesquisa e filtros por categoria, nicho e preço; somente produtos APROVADOS são exibidos.
- Página de detalhes de produto.
- Aprovação e rejeição de produtos pelo administrador.
- Registro de compra SIMULADA e histórico restrito ao comprador; não há pagamento real.
- Registro de denúncias por compradores e vendedores e atualização de status pelo administrador.
- Endpoint `/api/health` para verificar conectividade com PostgreSQL após a publicação.

### Verificações automatizadas concluídas
- Schema Prisma validado com Prisma ORM 7.10.1.
- Build de produção Next.js concluído no GitHub Actions.
- ESLint e TypeScript concluídos no GitHub Actions.
- `npm audit --audit-level=high` concluído sem vulnerabilidades de severidade alta ou crítica no conjunto instalado.
- CI do commit `175e0f1` concluído com sucesso.
- A Vercel confirmou o deploy do commit `175e0f1` no projeto principal `nexo-marketplace-7pjz`.

### Verificações manuais confirmadas
- Cadastro e login de usuário comprador realizados na aplicação publicada.
- Perfil de vendedor ativado com sucesso.
- Cadastro de produtos realizado; os registros persistiram no Neon e apareceram no painel após atualização manual.
- Endpoint `/api/health` consultado anteriormente e resposta esperada de conexão com o Neon confirmada pelo usuário.
- Um erro de origem inválida ocorreu ao acessar uma URL de Preview da Vercel; o uso do domínio principal configurado resolveu o acesso à autenticação.

### Ainda não verificado manualmente
- Aprovação/rejeição de produto com conta ADMIN.
- Compra simulada e consulta do histórico de compras.
- Registro de denúncia e moderação pelo ADMIN.
- Teste de todos os fluxos em janela anônima após o último deploy.
- Comparação integral com todos os itens do Anexo B da apostila.
- Verificação independente do endpoint `/api/health` após o último deploy (a resposta já havia sido confirmada na publicação anterior).

## 11. Condição de conclusão
O repositório público, histórico de commits, documentação e deploy principal estão disponíveis. Os testes automatizados e os fluxos manuais de cadastro, login, ativação de vendedor e persistência de produtos foram confirmados. Os fluxos administrativos, de compra e denúncia e a conferência integral do Anexo B permanecem como limitações de validação e não são declarados como testes concluídos.
