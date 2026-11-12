# Nexo Marketplace

Marketplace web para descoberta de produtos digitais de pequenos criadores e vendedores independentes.

## Estado atual

Reconstrução do MVP em andamento na branch `rebuild/nexo-mvp`. A branch `main` preserva o planejamento inicial. O código desta branch contém a fundação Next.js, TypeScript, Prisma e Better Auth, além da interface pública inicial e telas de autenticação.

**Atenção:** a aplicação ainda não está pronta para produção. A conexão com Neon, as migrations, os fluxos completos por perfil, os testes e o deploy precisam ser concluídos e verificados antes da entrega.

## Stack planejada

- Next.js App Router e TypeScript
- PostgreSQL no Neon
- Prisma ORM
- Better Auth
- Vercel

## Desenvolvimento local

1. Instale Node.js 22.12 ou superior.
2. Copie `.env.example` para `.env.local`.
3. Preencha `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET` e `BETTER_AUTH_URL` com valores do ambiente.
4. Instale dependências com `npm install`.
5. Gere o Prisma Client com `npm run db:generate`.
6. Inicie com `npm run dev`.

O schema existente do Neon foi inspecionado. Não execute `prisma migrate`, `db push` ou reset até existir uma migration revisada e aprovada para o banco.

Não execute migrations no banco Neon existente sem comparar previamente o schema e fazer backup. Não use `db push` ou comandos de reset em banco com dados que precisam ser preservados.

## Variáveis de ambiente

Consulte `.env.example`. Nunca faça commit de arquivos `.env`, senhas, tokens ou strings de conexão reais.

## Documentação

- [Spec](./spec.md)
- [Changelog](./CHANGELOG.md)
- [Plano estratégico](./docs/plano-estrategico.md)
