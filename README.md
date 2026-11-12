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



## Publicação na Vercel

1. Importe este repositório no painel da Vercel, selecionando a branch `main` depois que a reconstrução for integrada.
2. Mantenha o framework como Next.js e o diretório raiz como `./`.
3. Configure estas variáveis no ambiente Production:
   - `DATABASE_URL`: string pooled do Neon (host com `-pooler`).
   - `DIRECT_URL`: string direta do mesmo banco e branch.
   - `BETTER_AUTH_SECRET`: segredo aleatório forte, com pelo menos 32 caracteres.
   - `BETTER_AUTH_URL`: URL HTTPS final do projeto Vercel, sem barra no final.
4. Não configure migrations ou `db push` para este banco existente. O schema foi alinhado por inspeção; nenhuma migration é necessária para a versão atual.
5. Faça o deploy e abra `https://SEU-DOMINIO/api/health`. A resposta deve indicar `status: ok` e `database: connected`.

Gere o segredo localmente, por exemplo com `openssl rand -base64 32`. Não o envie pelo chat nem o salve no GitHub.

## Roteiro de teste manual

1. Abra a aplicação publicada e crie uma conta de comprador.
2. Entre no painel e ative o perfil de vendedor.
3. Cadastre um produto e confirme que ele aparece como PENDENTE no painel do vendedor.
4. Promova a conta administradora conforme o procedimento abaixo e entre novamente.
5. No painel administrativo, aprove o produto.
6. Abra o catálogo em uma sessão de comprador, acesse o produto e registre a compra demonstrativa.
7. Confira o histórico do comprador e teste o registro de uma denúncia.

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
