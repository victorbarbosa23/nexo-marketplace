# Nexo — Especificação do Sistema

## Estado da especificação
Esta especificação descreve o MVP planejado e está sendo reconciliada com o banco Neon existente. A implementação permanece em reconstrução na branch `rebuild/nexo-mvp`; requisitos não testados não devem ser considerados concluídos.

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
As consultas de leitura executadas em 12/11/2026 identificaram as tabelas `account`, `product`, `purchase`, `report`, `session`, `user` e `verification`.
- `Role`: ADMIN, COMPRADOR, VENDEDOR.
- `ProductStatus`: APROVADO, PENDENTE, REJEITADO.
- `PurchaseStatus`: SIMULADA.
- `ReportStatus`: ABERTA, EM_ANALISE, RESOLVIDA.
- Chaves estrangeiras observadas: account.userId -> user.id; session.userId -> user.id; product.sellerId -> user.id; purchase.buyerId -> user.id; purchase.productId -> product.id; report.reporterId -> user.id; report.productId -> product.id.
- A tabela `report` não possui coluna `updatedAt` na inspeção realizada. O schema Prisma foi ajustado para não presumir essa coluna.
- A existência de índices únicos de e-mail e token ainda precisa ser conferida separadamente.

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
Não aplicar migrations destrutivas, reset ou db push no banco Neon existente. Primeiro inspecionar o schema real, conferir índices e constraints, comparar a saída de `prisma db pull` em ambiente controlado e fazer backup. Nenhuma migration será aplicada sem revisão.
 
## 10. Condição de conclusão
A entrega só estará concluída quando o fluxo principal persistir no Neon, os critérios de aceite forem testados, o checklist de segurança for revisado, a aplicação estiver publicada em HTTPS e o repositório/histórico/documentação estiverem acessíveis ao professor.
