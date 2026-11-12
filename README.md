# Nexo Marketplace

Marketplace web para descoberta de produtos digitais de pequenos criadores e vendedores independentes.

## Estado da entrega — 12/11/2026

O MVP está na branch principal `main`, com o histórico de planejamento e desenvolvimento preservado. A branch `rebuild/nexo-mvp` também foi mantida como trilha de reconstrução.

**Aplicação publicada:** [https://nexo-marketplace-7pjz.vercel.app](https://nexo-marketplace-7pjz.vercel.app)

A Vercel confirmou como concluído o deploy do commit `175e0f1` no projeto `nexo-marketplace-7pjz`. O endpoint `/api/health` já foi consultado durante a validação manual e retornou a resposta esperada de conexão com o Neon. A última implantação concluiu com sucesso; os testes funcionais completos devem ser distinguidos dos testes automatizados.

### Validação confirmada
- Cadastro e login de comprador realizados manualmente.
- Ativação do perfil de vendedor realizada manualmente.
- Cadastro de produto realizado e persistência confirmada no Neon.
- Produtos consultados no painel após atualização manual da página.
- CI do commit `175e0f1` aprovado: validação Prisma, auditoria de dependências, build de produção, ESLint e TypeScript.
- Deploy do projeto principal `nexo-marketplace-7pjz` concluído pela Vercel.

### Ainda precisa de validação manual
- Moderação de produto por uma conta ADMIN.
- Compra demonstrativa e histórico do comprador.
- Registro e moderação de denúncia.
- Teste de acesso anônimo e comparação completa com o Anexo B da apostila.

Há uma segunda integração antiga da Vercel, associada ao projeto `nexo-marketplace`, que reportou falha. A implantação principal usada pelo projeto é `nexo-marketplace-7pjz`, cujo deploy mais recente foi concluído com sucesso.

## Stack

- Next.js App Router e TypeScript
- PostgreSQL no Neon
- Prisma ORM 7
- Better Auth
- Git/GitHub
- Vercel

## Desenvolvimento local

1. Instale Node.js 22.13 ou superior.
2. Copie `.env.example` para `.env.local`.
3. Preencha `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET` e `BETTER_AUTH_URL` com valores do ambiente.
4. Instale dependências com `npm install`.
5. Gere o Prisma Client com `npm run db:generate`.
6. Inicie com `npm run dev`.

O schema existente do Neon foi inspecionado. A aplicação usa Prisma ORM 7 com o adaptador serverless do Neon. Não execute `prisma migrate`, `db push` ou reset neste banco existente sem revisão e backup.

## Verificação de conexão

Abra `/api/health` no domínio publicado. A resposta esperada é `status: ok` e `database: connected`. Em caso de indisponibilidade, o endpoint retorna HTTP 503 sem revelar credenciais ou detalhes internos.

## Variáveis de ambiente

Consulte `.env.example`. As quatro variáveis de produção foram configuradas na Vercel. Nunca faça commit de arquivos `.env`, senhas, tokens ou strings de conexão reais.

## Documentação

- [Spec](./spec.md)
- [Changelog](./CHANGELOG.md)
- [Checklist preliminar de segurança](./docs/checklist-seguranca.md)
- [Plano estratégico](./docs/plano-estrategico.md)
- [Histórico de commits](https://github.com/victorbarbosa23/nexo-marketplace/commits/main)
- [Execução mais recente do CI](https://github.com/victorbarbosa23/nexo-marketplace/actions/runs/43326575007)

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
