# Nexo

Marketplace de descoberta de produtos digitais, voltado a pequenos criadores e vendedores independentes e a compradores que procuram produtos específicos ou de nicho.

## Estado do projeto

Planejamento inicial. A aplicação ainda será implementada.

## Documentos

- [`spec.md`](./spec.md): especificação formal e fonte principal dos requisitos do MVP.
- [`docs/plano-estrategico.md`](./docs/plano-estrategico.md): visão estratégica, posicionamento, riscos, validação e ideias de evolução. Este documento é contextual; em caso de conflito de escopo, prevalece a `spec.md` aprovada.
- [`CHANGELOG.md`](./CHANGELOG.md): registro das decisões, alterações, revisões e correções feitas durante o desenvolvimento.

## Stack planejada

- Next.js e TypeScript
- Prisma ORM
- PostgreSQL hospedado no Neon
- Better Auth, conforme a especificação
- Git e GitHub para versionamento
- Vercel para publicação

A stack e os detalhes da autenticação devem ser revisados durante o desenvolvimento antes de serem considerados implementados.

## Segurança

Nunca adicione senhas reais, tokens, chaves ou strings de conexão ao repositório. Use variáveis de ambiente locais, ignoradas pelo Git, e cadastre os valores de produção nas configurações do serviço de hospedagem.
