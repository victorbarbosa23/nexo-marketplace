# Changelog

Registro cronológico de implementação, decisões, revisões humanas e correções. Itens são marcados como concluídos somente após verificação.

## 2026-11-12 — Reconstrução do MVP (em andamento)

### Adicionado
- Criada a branch isolada `rebuild/nexo-mvp`, preservando a branch `main` e o histórico anterior.
- Adicionada a estrutura inicial Next.js App Router, TypeScript e scripts de projeto.
- Adicionado schema Prisma inicial para autenticação, produtos, compras e denúncias.
- Adicionada configuração inicial Better Auth e cliente de autenticação.
- Criadas telas públicas iniciais de apresentação, cadastro e login.
- Registradas a spec final em revisão e a documentação do estado real do projeto.

### Revisão humana baseada na inspeção do Neon
- Foram executadas consultas SQL somente de leitura na branch `production`, schema `public`.
- Confirmadas as sete tabelas: `account`, `product`, `purchase`, `report`, `session`, `user` e `verification`.
- Confirmados os enums e seus valores: Role (ADMIN, COMPRADOR, VENDEDOR), ProductStatus (APROVADO, PENDENTE, REJEITADO), PurchaseStatus (SIMULADA) e ReportStatus (ABERTA, EM_ANALISE, RESOLVIDA).
- Confirmadas as relações de chave estrangeira entre usuários, produtos, compras, denúncias, contas e sessões.
- Corrigido o schema Prisma: o campo `User.role` passou de String para enum `Role`, de acordo com o tipo PostgreSQL existente.
- Corrigido o schema Prisma: removido `Report.updatedAt`, pois a inspeção confirmou que essa coluna não existe na tabela `report`.
- Não foi executada nenhuma migration, alteração de tabela, inserção ou exclusão de dados.

### Decisões e limites
- A implementação foi reconstruída porque a branch inicial continha documentação, sem a aplicação completa.
- A conta pública recebe papel padrão COMPRADOR; o papel ADMIN não pode ser escolhido pelo formulário de cadastro.
- A compra permanece simulada, sem gateway, cobrança ou dados de cartão.
- A branch de reconstrução permanece separada da main para revisão sem substituir o planejamento original.
- A inspeção de índices únicos (e-mail e token de sessão), a validação de compatibilidade Better Auth/Prisma e a conferência de migrations continuam pendentes.
- As rotas de negócio, os painéis por perfil, os testes e o deploy ainda não foram concluídos.

### Pendências
- Conferir índices e constraints restantes do Neon.
- Validar o schema com `prisma db pull` e Prisma CLI sem escrever no banco.
- Implementar os fluxos de vendedor, comprador e administrador no servidor.
- Implementar catálogo, gestão de produtos, compras e denúncias de ponta a ponta.
- Provisionar administrador com procedimento seguro.
- Executar checklist de segurança e testes de aceitação.
- Configurar variáveis de produção e publicar na Vercel.
- Atualizar esta documentação após cada revisão e teste real.

## 2026-10-23 — Planejamento inicial
- Criada a especificação do MVP, o plano estratégico e a estrutura documental.
- Escopo definido: cadastro/login, publicação e moderação de produtos, catálogo, compra simulada, histórico e denúncias.
