# Estilo arquitetural e DDD

## Estilo arquitetural

O Lumina é composto por:

- um **backend monolítico em camadas** (controllers, models com Sequelize e middlewares), que atende o catálogo de livros e o acesso de usuários;
- um **frontend React**, que funciona como a camada de visão;
- um **microsserviço de notificações** (NestJS), separado porque o envio de e-mail é lento e pode falhar (ver ADR-001).

A comunicação entre backend e microsserviço é feita por eventos no Redis (ver ADR-002).

## Domínios e subdomínios

| Subdomínio | Tipo | Descrição |
|---|---|---|
| Catálogo de Livros | Principal | O coração do Lumina: livros, autores, categorias, editoras, coleções e destaques |
| Notificações | Apoio | Avisa os usuários por e-mail quando um livro novo é cadastrado |
| Identidade e Acesso | Apoio | Usuários, perfis e login de leitores e administrador |

## Bounded Contexts

| Contexto | Onde vive | Responsabilidade |
|---|---|---|
| Catálogo | Backend | Gerencia livros e seus relacionamentos; publica o evento `livro.cadastrado` |
| Identidade | Backend | Gerencia usuários, autenticação e papéis (leitor e administrador) |
| Notificações | Microsserviço (`notificacoes-db` próprio) | Recebe o evento, busca os destinatários e envia os e-mails |

Catálogo e Identidade são contextos conceituais dentro do mesmo backend. Notificações é um contexto físico separado, com código, container e banco próprios.

## Context Map

| Relação | Upstream (fornece) | Downstream (consome) | Como se comunicam |
|---|---|---|---|
| Catálogo → Notificações | Catálogo | Notificações | Evento `livro.cadastrado` no Redis (Pub/Sub) |
| Identidade → Notificações | Identidade (backend) | Notificações | API interna `GET /internal/destinatarios`, protegida por `x-api-key` |
| Identidade → Catálogo | Identidade | Catálogo | O perfil do usuário (leitor ou administrador) vai no token de login |

**Upstream** é quem fornece a informação ou o serviço; **downstream** é quem depende dele. Mudanças no upstream podem afetar o downstream, e não o contrário.

O diagrama está em `ContextMap.png`.

## Modelo tático (contexto de Notificações)

O contexto de Notificações guarda seus dados no `notificacoes-db`, em duas tabelas: `notificacoes` e `entregas_notificacao`.

### Agregado: Notificação

A **Notificação** é a raiz do agregado. Representa um aviso gerado a partir de um evento (por exemplo, um livro cadastrado) e agrupa as entregas feitas a cada destinatário.

**Entidades**

- `Notificacao` (raiz do agregado, tabela `notificacoes`): identificada por `id`; guarda o tipo, o título, a mensagem, os dados do evento (JSON opcional) e a data de criação.
- `EntregaNotificacao` (tabela `entregas_notificacao`): identificada por `id`; representa o envio da notificação a **um destinatário**. Pertence à notificação por `notificacao_id`.

**Objetos de Valor (VOs)**, definidos pelos seus valores e sem identidade própria:

- `TipoDeNotificacao`: classifica o aviso (por exemplo, `LIVRO_CADASTRADO`);
- `ConteudoDoAviso`: título e mensagem do e-mail;
- `Destinatario`: usuário e endereço de e-mail de quem recebe;
- `Canal`: meio de envio (padrão `EMAIL`);
- `StatusDeEntrega`: situação do envio a um destinatário (`PENDENTE`, `ENVIADA` ou `FALHOU`).

**Regras do agregado**

- A `EntregaNotificacao` pertence à `Notificacao`. Hoje o repositório atualiza a entrega diretamente ao registrar o resultado do envio; uma evolução possível é concentrar essas alterações na raiz.
- O status é controlado **por destinatário**: cada entrega começa como `PENDENTE` e termina como `ENVIADA` ou `FALHOU`.
- Em caso de sucesso, a entrega registra a data de envio e limpa o erro; em falha definitiva, registra a mensagem de erro.
- O envio é tentado até duas vezes antes de a entrega ser marcada como `FALHOU`.