# Nexo — Especificação do Sistema

## Estado da especificação
Esta especificação descreve o MVP planejado e está sendo reconciliada com o banco Neon existente. A implementação está na branch `main` e a trilha de reconstrução permanece na branch `rebuild/nexo-mvp`; requisitos não testados não devem ser considerados concluídos.

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
- Senhas protegidas por hash via biblioteca de autenticação.
- Validação de entrada no servidor.
- Prisma ORM ou consultas parametrizadas.
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

## 9. Segurança e banco
Não aplicar migrations destrutivas, reset ou db push no banco Neon existente. Conferir schema com introspecção controlada e backup antes de qualquer migration. Nenhuma migration será aplicada sem revisão.

## 10. Condição de conclusão
A entrega só estará concluída quando o fluxo principal persistir no Neon, os critérios de aceite forem testados, o checklist de segurança for revisado, a aplicação estiver publicada em HTTPS e o repositório/histórico/documentação estiverem acessíveis ao professor.

## 11. Estado real da implementação em 12/11/2026

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
- Endpoint /api/health para verificar conectividade com PostgreSQL após a publicação.

### Verificações concluídas
- Schema Prisma validado com Prisma ORM 7.10.1.
- Build de produção Next.js concluído no GitHub Actions.
- ESLint e TypeScript concluídos no GitHub Actions.
- npm audit --audit-level=high concluído sem vulnerabilidades de severidade alta ou crítica no conjunto instalado.

### Ainda não verificado
- Teste funcional com credenciais reais do Neon; o CI usa URLs fictícias e não acessa o banco de produção.
- Testes manuais dos fluxos com contas reais de cada papel.
- Comparação integral com o Anexo B da apostila.
- Publicação e teste anônimo da aplicação na Vercel.


## Registro de validação manual — 12/11/2026
- Cadastro e login de usuário comprador realizados na Vercel.
- Perfil de vendedor ativado com sucesso.
- Cadastro de produtos confirmado: os registros persistiram no Neon e foram exibidos no painel após atualização manual.
- A inspeção humana identificou e corrigiu uma falha de atualização da interface após o POST assíncrono; validar mensagem de sucesso e atualização automática no novo deploy.
