# Revisão preliminar de segurança — Nexo

Este documento registra a revisão humana feita com base nos requisitos informados para a atividade. Ele não substitui o Anexo B da apostila: o texto integral do anexo ainda precisa ser comparado item a item quando estiver disponível.

## Controles já implementados no código

- [x] Senhas gerenciadas pelo Better Auth com fluxo de e-mail e senha; a aplicação não implementa armazenamento de senha em texto puro.
- [x] Validação de payloads de produto e denúncia no servidor com Zod.
- [x] Consultas e gravações de dados por Prisma ORM, sem concatenar SQL recebido do usuário.
- [x] Verificação de sessão no servidor para rotas privadas.
- [x] Verificação de papel para operações de vendedor, comprador e administrador.
- [x] Verificação de propriedade antes de editar produto.
- [x] Cadastro público não permite selecionar o papel ADMIN.
- [x] Catálogo e detalhes públicos retornam somente produtos APROVADOS.
- [x] Histórico de compras limitado ao comprador autenticado.
- [x] Denúncias e moderação limitadas aos perfis autorizados.
- [x] Segredos lidos de variáveis de ambiente; arquivos .env ignorados pelo Git, exceto .env.example.
- [x] Compra explicitamente demonstrativa, sem gateway, cobrança ou armazenamento de cartão.

## Itens pendentes de validação antes da entrega

- [ ] Confirmar no fluxo real de cadastro que a senha armazenada pelo Better Auth está protegida por hash e nunca aparece em logs.
- [ ] Configurar DATABASE_URL, DIRECT_URL, BETTER_AUTH_SECRET e BETTER_AUTH_URL nos ambientes de produção sem publicar valores.
- [ ] Testar autorização com contas reais de COMPRADOR, VENDEDOR e ADMIN, inclusive tentativas de acesso cruzado.
- [ ] Executar teste completo de cadastro, login, logout, criação, aprovação, consulta, compra simulada e denúncia usando o Neon.
- [ ] Verificar HTTPS e cookies seguros depois do deploy.
- [ ] Revisar limites de requisição/rate limiting e proteção contra abuso antes de uso público amplo.
- [ ] Executar busca automatizada de segredos no histórico completo do GitHub.
- [ ] Conferir todos os itens do Anexo B da apostila quando o documento for fornecido.

## Provisionamento inicial do administrador

O papel ADMIN não é selecionável no cadastro público. Após criar a conta do responsável, a promoção é feita manualmente no SQL Editor do Neon, usando o e-mail exato da conta e conferindo o resultado. O procedimento está documentado no README.

## Banco de dados

As consultas realizadas em 12/11/2026 foram somente de leitura. Nenhuma migration, reset, db push, inserção ou exclusão foi executada durante a inspeção. Não executar alterações estruturais no Neon sem backup e revisão da migration.
