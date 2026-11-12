# Changelog

Registro cronológico de implementação, decisões, revisões humanas e correções. As entradas históricas são preservadas; o adendo final registra o estado atualizado em 12/11/2026.

## 2026-11-12 — Reconstrução do MVP

### Segurança e dependências
- A auditoria npm identificou vulnerabilidade alta em deepmerge-ts via Prisma ORM 6 e em Zod 3. Para corrigir sem ignorar o alerta, o projeto foi atualizado para Prisma ORM 7.10.1 com adaptador oficial do Neon e Zod 4.6.7.
- Prisma 7 passa a gerar o client em `src/generated/prisma` e a ler a conexão direta do CLI por `prisma.config.ts`; o runtime usa `DATABASE_URL` pooled por `@prisma/adapter-neon`.
- Nenhuma migration foi aplicada; a alteração é de dependências e configuração do client, mantendo o schema das tabelas existentes.
- CI identificou alerta de segurança na versão inicial Next.js 16.0.0; atualizado para Next.js 16.4.6.
- Atualizados React e React DOM para 19.3.1 e eslint-config-next para 16.4.6.
- Atualizado Node.js mínimo de CI para 22.13.0.

### Implementação e revisão humana
- Criada a branch isolada `rebuild/nexo-mvp`, preservando a branch `main` e o histórico anterior; posteriormente integrada à `main` por avanço rápido, preservando os commits.
- Adicionada a estrutura Next.js App Router, TypeScript, autenticação Better Auth, catálogo, detalhes, painéis por perfil e rotas para produtos, compras e denúncias.
- Consultas SQL somente de leitura executadas na branch `production`, schema `public`; confirmadas sete tabelas, enums, chaves estrangeiras, regras referenciais e índices existentes.
- Corrigido `User.role` de String para enum `Role`.
- Removido `Report.updatedAt` do Prisma, pois a coluna não existe na tabela real.
- Adicionados `@@map` para corresponder aos nomes físicos minúsculos das tabelas.
- Ajustados os índices Prisma para corresponder aos índices observados, removendo declarações de índices não existentes.
- Não foi executada nenhuma migration, alteração estrutural, reset ou exclusão de dados no Neon.
- A conta pública recebe papel padrão COMPRADOR; o papel ADMIN não pode ser escolhido pelo formulário público.
- A compra permanece simulada, sem gateway, cobrança ou dados de cartão.

### Correções e decisões após testes
- Corrigida a captura do formulário antes de operações assíncronas para evitar uso tardio de `event.currentTarget` no cadastro de produtos.
- Revisados os componentes de cadastro de denúncia, compra, moderação de produto, atualização de denúncia, ativação de vendedor e edição de produto para tratar falhas de rede e bloquear envios repetidos durante o processamento.
- Durante o teste de autenticação, uma URL de Preview da Vercel gerou erro de origem inválida. O uso do domínio principal configurado em `BETTER_AUTH_URL` resolveu o acesso.
- O cadastro de produto persistia no Neon, embora a lista não fosse atualizada automaticamente na primeira versão testada; a correção de interface foi enviada ao GitHub. O teste manual confirmou a persistência após atualização da página.

## 2026-11-12 — Validação, documentação e publicação
- Cadastro e login de comprador testados manualmente na aplicação publicada.
- Ativação do perfil de vendedor testada manualmente.
- Cadastro e consulta de produtos testados; a persistência dos registros no Neon foi confirmada após atualização manual da página.
- Endpoint `/api/health` consultado durante a validação inicial; o usuário confirmou a resposta esperada de conexão com o Neon.
- Variáveis de ambiente de produção configuradas na Vercel sem registrar seus valores no repositório.
- GitHub Actions do commit `175e0f1` concluído com sucesso: validação Prisma, auditoria de dependências, build de produção, ESLint e TypeScript.
- Vercel confirmou o deploy do commit `175e0f1` no projeto principal `nexo-marketplace-7pjz`.
- Uma integração adicional vinculada ao projeto Vercel antigo `nexo-marketplace` reportou falha; a implantação principal utilizada é `nexo-marketplace-7pjz`.
- Atualizados README, spec e checklist para distinguir testes confirmados de fluxos ainda não validados.

### Pendências transparentes
- Testar moderação de produtos com conta ADMIN.
- Testar compra simulada e histórico do comprador.
- Testar registro e moderação de denúncias.
- Executar o teste anônimo de todos os links após o último deploy.
- Comparar integralmente o checklist de segurança com o Anexo B original da apostila.
- Realizar verificação independente do endpoint de saúde após o último deploy.
