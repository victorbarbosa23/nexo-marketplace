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
- Consultas SQL somente de leitura executadas na branch `production`, schema `public`.
- Confirmadas as sete tabelas e quatro enums, incluindo todos os valores.
- Confirmadas as chaves primárias e estrangeiras entre usuários, produtos, compras, denúncias, contas e sessões, incluindo regras ON DELETE e ON UPDATE.
- Explicitadas no Prisma as regras referenciais verificadas: CASCADE para account/session em exclusão, RESTRICT para registros comerciais, e CASCADE em atualização de chave para todas as relações.
- Confirmados os índices existentes: PKs, unique `user.email`, unique `session.token`, `product(status, category)`, `product(status, niche)`, `purchase(buyerId)` e `report(status)`.
- Corrigido `User.role` de String para enum `Role`.
- Removido `Report.updatedAt` do Prisma, pois a coluna não existe na tabela real.
- Adicionados `@@map("product")`, `@@map("purchase")` e `@@map("report")`, pois os nomes físicos das tabelas são minúsculos.
- Ajustados os índices Prisma para corresponder aos índices observados, removendo declarações de índices não existentes e mapeando os nomes reais.
- Não foi executada nenhuma migration, alteração de tabela, inserção ou exclusão de dados.

### Decisões e limites
- A implementação foi reconstruída porque a branch inicial continha documentação, sem a aplicação completa.
- A conta pública recebe papel padrão COMPRADOR; o papel ADMIN não pode ser escolhido pelo formulário de cadastro.
- A compra permanece simulada, sem gateway, cobrança ou dados de cartão.
- A branch de reconstrução permanece separada da main para revisão sem substituir o planejamento original.
- A compatibilidade Better Auth/Prisma, build, rotas de negócio, painéis por perfil, testes e deploy ainda precisam ser validados.

- Implementadas rotas protegidas para cadastro de produtos, edição própria, moderação, compra simulada, histórico e denúncias; pendente validação funcional com banco real.
- Implementados catálogo filtrável, detalhes de produto e painéis por perfil; a execução de CI confirmou Prisma validate, build Next.js e TypeScript no commit de implementação.

- Adicionado controle de edição de produto próprio, logout e restrição visual dos botões de compra/denúncia conforme o perfil autenticado.
- Corrigida a captura do formulário antes de operações assíncronas para evitar uso tardio de `currentTarget`.
- Adicionada tipagem explícita dos produtos exibidos na página inicial.

- Removidas variáveis de provisionamento administrativo que não eram utilizadas; a promoção inicial de ADMIN é feita por ação explícita e documentada no Neon.
- Ajustado o limite de preço para respeitar a precisão de duas casas decimais da coluna NUMERIC(10,2).

### Pendências
- Executar validação Prisma e comparação read-only com o Neon; revisar compatibilidade da introspecção e dos índices.
- Implementar os fluxos de vendedor, comprador e administrador no servidor.
- Implementar catálogo, gestão de produtos, compras e denúncias de ponta a ponta.
- Provisionar administrador com procedimento seguro.
- Executar checklist de segurança e testes de aceitação.
- Configurar variáveis de produção e publicar na Vercel.
- Atualizar esta documentação após cada revisão e teste real.

## 2026-10-23 — Planejamento inicial
- Criada a especificação do MVP, o plano estratégico e a estrutura documental.
- Escopo definido: cadastro/login, publicação e moderação de produtos, catálogo, compra simulada, histórico e denúncias.
