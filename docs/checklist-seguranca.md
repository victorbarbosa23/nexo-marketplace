# Revisão preliminar de segurança — Nexo

Este documento registra a revisão humana feita com base nos requisitos informados para a atividade. Ele não substitui o Anexo B da apostila: o texto integral do anexo ainda precisa ser comparado item a item quando estiver disponível.

## Controles revisados no código
- [x] Senhas gerenciadas pelo Better Auth; a aplicação não implementa armazenamento de senha em texto puro.
- [x] Validação de payloads de produto e denúncia no servidor com Zod.
- [x] Consultas e gravações de dados por Prisma ORM.
- [x] Verificação de sessão no servidor para rotas privadas.
- [x] Verificação de papel para operações de vendedor, comprador e administrador.
- [x] Verificação de propriedade antes de editar produto.
- [x] Cadastro público não permite selecionar o papel ADMIN.
- [x] Catálogo e detalhes públicos retornam somente produtos APROVADOS.
- [x] Histórico de compras limitado ao comprador autenticado.
- [x] Denúncias e moderação limitadas aos perfis autorizados.
- [x] Segredos lidos de variáveis de ambiente; arquivos .env ignorados pelo Git, exceto .env.example.
- [x] Compra explicitamente demonstrativa, sem gateway, cobrança ou armazenamento de cartão.

## Verificações automatizadas concluídas
- [x] GitHub Actions executou com sucesso: Prisma validate, build Next.js, ESLint e TypeScript check.
- [x] Next.js 16.4.6 e React 19.3.1 atualizados após alerta de segurança.
- [x] Prisma ORM 7.10.1, adaptador Neon e Zod 4.6.7 validados pelo CI.
- [x] npm audit --audit-level=high passou sem vulnerabilidades de severidade alta ou crítica no conjunto instalado; alertas de severidade inferior podem permanecer.
- [x] Deploy principal `nexo-marketplace-7pjz` do commit `175e0f1` confirmado pela Vercel.

## Verificações manuais concluídas
- [x] Variáveis de ambiente de produção configuradas na Vercel; os valores não foram incluídos no GitHub.
- [x] Cadastro e login de comprador.
- [x] Ativação do perfil de vendedor.
- [x] Cadastro e persistência de produtos no Neon.
- [x] Consulta dos produtos persistidos após atualização manual da página.
- [x] Endpoint de saúde consultado na publicação inicial e resposta esperada confirmada pelo usuário.

## Itens ainda pendentes
- [ ] Testar autorização com contas reais de COMPRADOR, VENDEDOR e ADMIN, inclusive tentativas de acesso cruzado.
- [ ] Testar aprovação/rejeição de produtos pelo ADMIN.
- [ ] Testar compra simulada e histórico do comprador.
- [ ] Testar registro e moderação de denúncias.
- [ ] Verificar HTTPS e cookies seguros em produção.
- [ ] Revisar limites de requisição/rate limiting e proteção contra abuso antes de uso público amplo.
- [ ] Executar busca automatizada de segredos no histórico completo do GitHub.
- [ ] Testar os dois links em janela anônima após o último deploy.
- [ ] Conferir todos os itens do Anexo B original da apostila.

## Provisionamento inicial do administrador
O papel ADMIN não é selecionável no cadastro público. Após criar a conta do responsável, a promoção é feita manualmente no SQL Editor do Neon, usando o e-mail exato da conta e conferindo o resultado. O procedimento está documentado no README.

## Banco de dados
As consultas de estrutura realizadas em 12/11/2026 foram somente de leitura. Nenhuma migration, reset, db push ou exclusão foi executada durante a inspeção. Não executar alterações estruturais no Neon sem backup e revisão.
