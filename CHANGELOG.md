# Changelog

Registro cronológico de implementação, decisões humanas, revisões e correções. Itens são marcados como concluídos somente após verificação.

## 2026-11-12 — Reconstrução do MVP (em andamento)

### Adicionado
- Criada a branch isolada `rebuild/nexo-mvp`, preservando a branch `main` e o commit de planejamento.
- Adicionada a estrutura inicial Next.js App Router, TypeScript e scripts de projeto.
- Adicionado schema Prisma para usuário, sessão, conta, verificação, produto, compra e denúncia.
- Adicionada configuração inicial Better Auth e cliente de autenticação.
- Criadas telas públicas iniciais de apresentação, cadastro e login.

### Decisões e revisão humana
- A implementação foi reconstruída porque a branch original continha somente documentação; não havia código da aplicação, package.json ou schema Prisma.
- A conta pública recebe papel padrão COMPRADOR; o papel ADMIN não pode ser escolhido pelo formulário de cadastro.
- A compra permanece simulada, sem gateway, cobrança ou dados de cartão.
- A branch de reconstrução foi separada da main para permitir revisão sem substituir o planejamento original.
- Nenhuma migration foi aplicada e nenhum dado do Neon foi alterado.
- O schema Prisma e a integração Better Auth ainda precisam de validação com as versões instaladas e com o banco real.

### Pendências
- Confirmar versões e compatibilidade de dependências por instalação e build.
- Comparar o schema com o banco Neon existente antes de qualquer migration.
- Implementar e testar os fluxos de vendedor, comprador e administrador no servidor.
- Implementar catálogo, gestão de produtos, compras e denúncias de ponta a ponta.
- Provisionar administrador com procedimento seguro.
- Executar checklist de segurança e testes de aceitação.
- Configurar variáveis de produção e publicar na Vercel.
- Atualizar esta documentação após cada revisão e teste real.

## 2026-10-23 — Planejamento inicial
- Criada a especificação do MVP, o plano estratégico e a estrutura documental.
- Escopo definido: cadastro/login, publicação e moderação de produtos, catálogo, compra simulada, histórico e denúncias.
