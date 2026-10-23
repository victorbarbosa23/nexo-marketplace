# Nexo — Especificação do Sistema (`spec.md`)

## 1. Objetivo

O Nexo é um marketplace web de produtos digitais voltado a pequenos criadores e vendedores independentes, além de compradores que procuram produtos específicos ou de nicho. No MVP, o sistema permitirá cadastro e login, publicação e moderação de produtos, pesquisa e filtros, consulta de detalhes, registro de compras simuladas e envio de denúncias, buscando facilitar a descoberta de produtos e ampliar as oportunidades de visibilidade dos vendedores.

## 2. Usuários

### 2.1 Visitante (sem login)
- Consultar o catálogo público de produtos aprovados.
- Pesquisar produtos por palavra-chave.
- Filtrar produtos por categoria, nicho e faixa de preço.
- Consultar os detalhes de um produto aprovado.
- Criar uma conta ou entrar para acessar funções que exigem autenticação.

### 2.2 Comprador (`COMPRADOR`)
- Entrar e sair da conta.
- Realizar todas as ações disponíveis ao visitante.
- Registrar uma compra simulada de um produto aprovado.
- Consultar apenas o próprio histórico de compras.
- Denunciar um produto.

### 2.3 Vendedor (`VENDEDOR`)
- Entrar e sair da conta.
- Cadastrar produtos digitais.
- Consultar e editar os próprios produtos.
- Consultar o status de cada produto: pendente, aprovado ou rejeitado.
- Denunciar um produto.

### 2.4 Administrador (`ADMIN`)
- Entrar e sair da conta.
- Consultar produtos pendentes de moderação.
- Aprovar ou rejeitar produtos.
- Consultar denúncias recebidas e atualizar o status delas.

**Regra de acesso:** o cadastro público permite criar somente contas `COMPRADOR` ou `VENDEDOR`. A conta `ADMIN` será criada por um procedimento de inicialização protegido, nunca escolhida livremente em um formulário público. O sistema deve verificar as permissões no servidor, e não apenas ocultar botões na interface.

## 3. Casos de uso principais

- **UC01 — Cadastrar conta:** visitante cria uma conta de comprador ou vendedor.
- **UC02 — Entrar e sair:** usuário registrado inicia ou encerra uma sessão.
- **UC03 — Cadastrar produto:** vendedor registra um produto digital, que começa com status pendente.
- **UC04 — Consultar e editar produtos próprios:** vendedor consulta seus produtos e edita os dados permitidos; uma alteração em produto aprovado o devolve ao status pendente para nova análise.
- **UC05 — Moderar produto:** administrador consulta produtos pendentes e aprova ou rejeita cada um.
- **UC06 — Explorar catálogo:** visitante ou usuário autenticado consulta, pesquisa e filtra produtos aprovados.
- **UC07 — Consultar detalhes do produto:** visitante ou usuário autenticado abre a página de um produto aprovado.
- **UC08 — Registrar compra simulada:** comprador autenticado registra no banco uma compra de produto aprovado, sem cobrança real.
- **UC09 — Consultar compras:** comprador consulta somente as próprias compras simuladas.
- **UC10 — Denunciar produto:** comprador ou vendedor autenticado envia uma denúncia sobre um produto.
- **UC11 — Moderar denúncia:** administrador consulta denúncias e atualiza seus status.
- **UC12 — Controlar acesso por perfil:** o sistema permite ou nega ações e páginas protegidas de acordo com a sessão e o perfil do usuário.

## 4. Requisitos funcionais (RF)

- **RF01 — Cadastro:** o sistema deve permitir cadastrar uma conta com nome, e-mail e senha, escolhendo somente o perfil `COMPRADOR` ou `VENDEDOR`. O e-mail deve ser único e os dados devem ser validados no servidor. **Caso de uso:** UC01.
- **RF02 — Autenticação:** o sistema deve permitir que usuários registrados entrem e saiam da conta, com mensagens adequadas para credenciais inválidas. **Caso de uso:** UC02.
- **RF03 — Autorização por perfil:** o sistema deve permitir cada ação somente aos perfis autorizados. O perfil `ADMIN` não pode ser concedido pelo cadastro público; sua conta deve ser provisionada por procedimento protegido. **Caso de uso:** UC12.
- **RF04 — Cadastrar produto:** o vendedor deve poder cadastrar produto com nome, descrição, categoria, nicho e preço maior que zero. Um produto novo deve ser salvo com status `PENDENTE`. **Caso de uso:** UC03.
- **RF05 — Consultar e editar produtos próprios:** o vendedor deve poder listar os próprios produtos e editar seus dados. O sistema deve impedir que um vendedor consulte ou altere produtos privados de outro vendedor pela área de gerenciamento. Se um produto aprovado for editado, seu status deve voltar para `PENDENTE`. **Caso de uso:** UC04.
- **RF06 — Moderar produtos:** o administrador deve poder consultar produtos pendentes e alterar seu status para `APROVADO` ou `REJEITADO`. **Caso de uso:** UC05.
- **RF07 — Catálogo público:** o sistema deve exibir no catálogo público somente produtos com status `APROVADO`; visitantes podem consultar o catálogo sem criar uma conta. **Caso de uso:** UC06.
- **RF08 — Pesquisa por palavra-chave:** o catálogo deve permitir pesquisar produtos pelo nome ou pela descrição, retornando somente produtos aprovados que correspondam à pesquisa. **Caso de uso:** UC06.
- **RF09 — Filtros:** o catálogo deve permitir filtrar produtos aprovados por categoria, nicho e preço mínimo/máximo, permitindo combinar os filtros. **Caso de uso:** UC06.
- **RF10 — Detalhes do produto:** a página de detalhes deve exibir, no mínimo, nome, descrição, categoria, nicho, preço e nome público do vendedor, sem expor dados privados do vendedor. **Caso de uso:** UC07.
- **RF11 — Compra simulada:** um comprador autenticado deve poder registrar uma compra de produto aprovado. O sistema deve gravar comprador, produto, preço no momento da compra, data e status `SIMULADA` no banco. A operação não deve realizar cobrança nem solicitar dados de cartão. **Caso de uso:** UC08.
- **RF12 — Histórico de compras:** o comprador deve poder consultar somente as compras associadas à própria conta. **Caso de uso:** UC09.
- **RF13 — Denúncias:** comprador ou vendedor autenticado deve poder enviar uma denúncia ligada a um produto, informando motivo e descrição. A denúncia deve ser gravada com status inicial `ABERTA`. **Caso de uso:** UC10.
- **RF14 — Gerenciar denúncias:** o administrador deve poder consultar denúncias e alterar seu status para `EM_ANALISE` ou `RESOLVIDA`. **Caso de uso:** UC11.

### 4.1 Limites do MVP

Esta versão não realizará pagamentos reais, repasses ou comissões; não hospedará nem entregará automaticamente os arquivos digitais comprados; e não incluirá chat, avaliações/estrelas, recomendações por inteligência artificial, programa de afiliados ou aplicativo móvel nativo. A compra será apenas um registro demonstrativo no banco de dados. Esses recursos poderão ser avaliados em versões futuras, mas não são critérios de conclusão desta versão.

## 5. Requisitos não funcionais (RNF)

- **RNF01 — Proteção de senhas:** senhas nunca devem ser armazenadas ou registradas em texto puro. A autenticação deve utilizar hash seguro por meio da biblioteca de autenticação escolhida.
- **RNF02 — Validação no servidor:** todo formulário e toda entrada enviada pelo usuário devem ser validados no servidor; a validação no navegador, sozinha, não é suficiente.
- **RNF03 — Consultas seguras:** consultas ao banco devem utilizar Prisma/ORM ou consultas parametrizadas. Não se deve montar SQL concatenando diretamente dados fornecidos pelo usuário.
- **RNF04 — Credenciais:** strings de conexão, segredos de autenticação e outras credenciais devem ficar em variáveis de ambiente e nunca ser commitados no GitHub. O `.gitignore` deve excluir arquivos locais com segredos; um `.env.example` pode conter somente nomes e valores de exemplo sem credenciais reais.
- **RNF05 — Autorização no servidor:** cada operação protegida deve verificar sessão, perfil e propriedade do registro no servidor. Ocultar um botão na interface não conta como controle de acesso.
- **RNF06 — Sessão segura:** a autenticação deve usar uma biblioteca mantida e cookies de sessão configurados com atributos de segurança apropriados em produção.
- **RNF07 — Erros:** as mensagens exibidas ao usuário não devem revelar consultas SQL, segredos, stack traces ou detalhes internos da aplicação.
- **RNF08 — HTTPS:** a versão publicada deve ser acessível por HTTPS.
- **RNF09 — Interface adaptável:** as telas principais devem funcionar em navegadores atuais de computador e celular, sem exigir instalação.
- **RNF10 — Desempenho básico:** com até 100 produtos de teste e uma conexão estável, as operações usuais de consultar, pesquisar e filtrar o catálogo devem responder em até 3 segundos, desconsiderando indisponibilidade externa de rede ou do serviço de hospedagem.
- **RNF11 — Persistência:** usuários, produtos, compras e denúncias devem permanecer registrados no banco após atualizar a página ou encerrar a sessão.

## 6. Modelo de dados (DER simples)

O banco será PostgreSQL. As tabelas de autenticação necessárias serão gerenciadas pela integração do Better Auth com Prisma; os modelos abaixo descrevem as entidades da aplicação e seus relacionamentos lógicos.

### 6.1 Entidades e campos principais

**User (usuário)** — tabela de autenticação estendida com o campo de perfil:
- `id` — chave primária.
- `name` — nome do usuário.
- `email` — obrigatório e único.
- `role` — `COMPRADOR`, `VENDEDOR` ou `ADMIN`.
- `createdAt`, `updatedAt` — datas de criação e atualização.
- Os campos adicionais obrigatórios para o Better Auth, como confirmação de e-mail quando habilitada, serão mantidos conforme o esquema da biblioteca.

**Account, Session e Verification** — tabelas auxiliares mantidas pela integração Better Auth para contas de autenticação, sessões e verificações. `Account.userId` e `Session.userId` referenciam `User.id`. Senhas de credenciais devem ser protegidas pela biblioteca e nunca armazenadas em texto puro.

**Product (produto):**
- `id` — chave primária.
- `sellerId` — chave estrangeira para `User.id`.
- `name` — nome do produto.
- `description` — descrição do produto.
- `category` — categoria usada nos filtros.
- `niche` — nicho do produto.
- `price` — preço decimal, armazenado com precisão monetária (por exemplo, `DECIMAL(10,2)`).
- `status` — `PENDENTE`, `APROVADO` ou `REJEITADO`.
- `createdAt`, `updatedAt` — datas de criação e atualização.

**Purchase (compra):**
- `id` — chave primária.
- `buyerId` — chave estrangeira para `User.id`.
- `productId` — chave estrangeira para `Product.id`.
- `priceAtPurchase` — preço registrado no momento da compra, em tipo decimal.
- `status` — `SIMULADA`.
- `createdAt` — data de registro.

**Report (denúncia):**
- `id` — chave primária.
- `reporterId` — chave estrangeira para `User.id`.
- `productId` — chave estrangeira para `Product.id`.
- `reason` — motivo da denúncia.
- `description` — descrição fornecida pelo usuário.
- `status` — `ABERTA`, `EM_ANALISE` ou `RESOLVIDA`.
- `createdAt` — data de registro.

### 6.2 Relacionamentos

- Um `User` com perfil `VENDEDOR` pode possuir vários `Product`; cada `Product` pertence a um vendedor (`Product.sellerId → User.id`).
- Um `User` com perfil `COMPRADOR` pode possuir vários `Purchase`; cada `Purchase` pertence a um comprador (`Purchase.buyerId → User.id`).
- Um `Product` pode aparecer em várias `Purchase` (`Purchase.productId → Product.id`).
- Um `User` pode registrar várias `Report`; cada `Report` identifica o usuário que denunciou (`Report.reporterId → User.id`).
- Um `Product` pode receber várias `Report` (`Report.productId → Product.id`).
- Um `User` pode possuir várias contas auxiliares/sessões de autenticação conforme o esquema Better Auth (`Account.userId → User.id`; `Session.userId → User.id`).

A autorização no servidor deve conferir também o perfil do usuário: a existência de uma chave estrangeira, por si só, não garante que o usuário tenha permissão para executar uma ação. No MVP, a categoria e o nicho serão armazenados diretamente em `Product`, sem tabelas separadas para essas classificações.

## 7. Critérios de aceite

Cada critério abaixo deve ser testado manualmente antes da entrega. Os critérios AC01–AC14 cobrem os requisitos funcionais; AC15 verifica a meta de desempenho.

- **AC01 — Cadastro (RF01/UC01):** dado que um visitante preenche nome, e-mail, senha e perfil permitido com dados válidos e um e-mail ainda não utilizado, quando envia o cadastro, então a conta deve ser criada no banco. Se o e-mail já existir ou os dados forem inválidos, o cadastro deve ser recusado com uma mensagem compreensível. O formulário público não deve permitir criar perfil `ADMIN`.
- **AC02 — Login e logout (RF02/UC02):** dado que a conta existe, quando o usuário informa credenciais válidas, então deve conseguir entrar e acessar sua área permitida; quando sair da conta, a sessão deve ser encerrada. Credenciais inválidas não devem iniciar uma sessão.
- **AC03 — Autorização (RF03/UC12):** dado que um usuário tenta abrir uma página ou executar uma operação de outro perfil, quando a solicitação chega ao servidor, então o sistema deve negar o acesso e não alterar dados indevidamente.
- **AC04 — Criar produto (RF04/UC03):** dado que um vendedor autenticado preenche os campos obrigatórios com dados válidos, quando cadastra o produto, então o registro deve ser salvo com status `PENDENTE`.
- **AC05 — Consultar e editar próprios produtos (RF05/UC04):** dado que um vendedor possui produtos, quando abre sua área de gerenciamento, então deve ver apenas os próprios produtos. Ao editar um deles, a alteração deve ser salva; se o produto estava aprovado, seu status deve voltar para `PENDENTE`. Uma tentativa de editar produto de outro vendedor deve ser negada.
- **AC06 — Aprovação/rejeição (RF06/UC05):** dado que existe um produto pendente, quando o administrador o aprova ou rejeita, então o status deve ser atualizado no banco para `APROVADO` ou `REJEITADO`, respectivamente.
- **AC07 — Catálogo público (RF07/UC06):** dado que existem produtos com diferentes status, quando um visitante abre o catálogo, então somente os produtos `APROVADO` devem aparecer; produtos pendentes ou rejeitados não devem ser exibidos como disponíveis.
- **AC08 — Pesquisa (RF08/UC06):** dado que há produtos aprovados com nomes ou descrições correspondentes a um termo, quando o visitante pesquisa esse termo, então os resultados devem conter somente produtos aprovados que correspondam à pesquisa.
- **AC09 — Filtros (RF09/UC06):** dado que existem produtos aprovados com categorias, nichos e preços diferentes, quando o visitante aplica um ou mais filtros, então os resultados devem respeitar todos os filtros selecionados.
- **AC10 — Detalhes (RF10/UC07):** dado que um produto está aprovado, quando o visitante abre sua página, então deve ver nome, descrição, categoria, nicho, preço e nome público do vendedor, sem dados privados. Produtos não aprovados não devem ser acessíveis como páginas públicas de produto disponível.
- **AC11 — Compra simulada (RF11/UC08):** dado que um comprador autenticado consulta um produto aprovado, quando aciona a compra simulada, então deve ser criado no banco um registro com comprador, produto, preço no momento da compra, data e status `SIMULADA`, sem processar pagamento real. A compra de produto não aprovado deve ser recusada.
- **AC12 — Histórico (RF12/UC09):** dado que o comprador possui compras registradas, quando abre seu histórico, então deve ver suas próprias compras, sem conseguir consultar o histórico de outro usuário.
- **AC13 — Enviar denúncia (RF13/UC10):** dado que um comprador ou vendedor autenticado envia um motivo e uma descrição válidos para um produto, quando confirma a denúncia, então o registro deve ser salvo com status `ABERTA`.
- **AC14 — Gerenciar denúncias (RF14/UC11):** dado que existem denúncias registradas, quando o administrador abre a área de moderação, então deve conseguir consultá-las e atualizar o status para `EM_ANALISE` ou `RESOLVIDA`. Usuários sem perfil `ADMIN` não devem conseguir executar essas ações.
- **AC15 — Desempenho básico (RNF10):** dado um banco de teste com até 100 produtos e uma conexão estável, quando as operações usuais de consulta, pesquisa e filtragem do catálogo forem executadas, então cada operação deve responder em até 3 segundos nas condições definidas no RNF10.

## 8. Decisão de stack e deploy

### 8.1 Tecnologias escolhidas

- **Linguagens:** TypeScript/TSX para a aplicação e SQL para consultas pontuais quando necessárias; HTML e CSS compõem a estrutura e apresentação geradas pelo Next.js.
- **Framework e runtime:** Next.js com App Router e Node.js.
- **Banco de dados:** PostgreSQL hospedado no Neon.
- **Acesso ao banco e modelos:** Prisma ORM.
- **Autenticação e sessões:** Better Auth integrado ao Next.js e Prisma; o esquema auxiliar de autenticação será gerenciado conforme a documentação da biblioteca.
- **Estilização:** CSS Modules, evitando uma dependência visual adicional no MVP.
- **Versionamento:** Git e GitHub.
- **Publicação:** Vercel, conectada ao repositório GitHub, com deploy automático a partir da branch principal.

### 8.2 Justificativa

Essa stack permite construir uma aplicação web com interface e lógica de servidor no mesmo projeto, persistir os dados em PostgreSQL e publicar o sistema sem exigir instalação por parte do avaliador. O Neon fornece o banco em nuvem; a Vercel hospeda a aplicação Next.js; e Git/GitHub mantêm o histórico de desenvolvimento exigido na atividade. A escolha também evita depender de um servidor PHP tradicional, que não é compatível com o caminho de deploy Vercel descrito na apostila.

### 8.3 Variáveis de ambiente e publicação

As configurações sensíveis serão mantidas fora do código-fonte, em variáveis de ambiente:
- `DATABASE_URL` — conexão com PostgreSQL/Neon.
- `BETTER_AUTH_SECRET` — segredo utilizado pela autenticação.
- `BETTER_AUTH_URL` — URL base pública da aplicação.
- `ADMIN_EMAIL` e `ADMIN_INITIAL_PASSWORD` — usadas apenas pelo procedimento protegido de criação inicial do administrador; não devem ser commitadas, e a senha inicial deve ser removida das variáveis após o provisionamento quando não for mais necessária.

O repositório incluirá `spec.md`, `CHANGELOG.md`, `README.md` e `.env.example` sem valores secretos reais. O projeto será publicado em uma URL pública do Vercel e testado em uma janela anônima do navegador antes da entrega. O histórico Git deve conter commits pequenos e descritivos desde o início do desenvolvimento.

### 8.4 Limites e condição de conclusão

O MVP estará pronto para entrega quando cadastro/login, controle de acesso, cadastro e moderação de produtos, catálogo com pesquisa/filtros, compra simulada, histórico de compras e denúncias funcionarem no banco; os critérios de aceite tiverem sido executados; o checklist de segurança da apostila tiver sido conferido; e os links do GitHub e do sistema publicado estiverem acessíveis sem instalação. Mudanças relevantes na implementação deverão ser registradas no `CHANGELOG.md` e refletidas nesta spec quando alterarem o comportamento combinado.
