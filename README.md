# Nexo Marketplace

Marketplace web para descoberta de produtos digitais de pequenos criadores e vendedores independentes.

## Estado atual

Reconstrução do MVP em andamento na branch `rebuild/nexo-mvp`. A branch `main` preserva o planejamento inicial. O código desta branch contém a fundação Next.js, TypeScript, Prisma e Better Auth, além da interface pública inicial e telas de autenticação.

**Estado atual:** a reconstrução já inclui autenticação, catálogo, detalhes de produtos, painéis por perfil e rotas protegidas para vendedores, compradores e administradores. O CI já passou em validação Prisma, build de produção, lint e TypeScript usando URLs de banco fictícias de teste. Ainda faltam testes funcionais conectados ao Neon real, comparação final do Anexo B e publicação na Vercel.

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

## Verificação de conexão

Após a publicação, abra `/api/health` no domínio do projeto. A resposta `status: ok` e `database: connected` confirma que a aplicação conseguiu consultar o Neon. Em caso de indisponibilidade, o endpoint retorna HTTP 503 sem revelar credenciais ou detalhes internos.

## Variáveis de ambiente

Consulte `.env.example`. Nunca faça commit de arquivos `.env`, senhas, tokens ou strings de conexão reais.

## Documentação

- [Spec](./spec.md)
- [Changelog](./CHANGELOG.md)
- [Plano estratégico](./docs/plano-estrategico.md)


## Primeiro administrador

O cadastro público cria somente contas COMPRADOR. Para conceder o papel ADMIN ao primeiro usuário, primeiro crie a conta normalmente pela tela de cadastro. Depois, no SQL Editor do Neon, execute uma atualização restrita ao e-mail exato dessa conta:

```sql
UPDATE public."user"
SET role = 'ADMIN'
WHERE email = 'SEU_EMAIL_DE_LOGIN';
```

Substitua o texto pelo e-mail usado no cadastro. Confira o resultado com:

```sql
SELECT id, name, email, role
FROM public."user"
WHERE email = 'SEU_EMAIL_DE_LOGIN';
```

Não exponha credenciais no repositório. Faça essa promoção apenas para a conta administradora responsável pelo projeto.
