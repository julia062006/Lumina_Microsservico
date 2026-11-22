# ADR-002: Redis para comunicação por eventos (Pub/Sub) e cache

- **Status:** Aceito
- **Data:** 22/11/2026
- **Decisores:** Equipe do projeto Lumina

## Contexto

Com o microsserviço de notificações separado (ADR-001), o backend precisa avisá-lo quando um livro é cadastrado, sem esperar o envio do e-mail terminar. Além disso, o backend faz consultas repetidas ao catálogo que podem ser guardadas em cache. O Redis já estava no projeto, então podia atender às duas necessidades.

## Decisão

- **Comunicação:** usar o Pub/Sub do Redis. O backend publica o evento no canal `livro.cadastrado` e o microsserviço de notificações assina esse canal.
- **Cache:** usar o Redis (padrão cache-aside) para guardar resultados de consultas do backend, com expiração (TTL) por consulta:
  - lista de livros e destaques: 300 s (5 min);
  - livro por ID: 600 s (10 min);
  - o valor pode ser substituído pela variável de ambiente `CACHE_TTL_OVERRIDE`.
- **Invalidação:** após cadastro, edição ou remoção de livro, o backend apaga as chaves com prefixo `livros:` (via `SCAN` + `UNLINK`), evitando dados desatualizados.

## Alternativas consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| Chamada HTTP direta do backend ao microsserviço | O backend ficaria acoplado: se o microsserviço estiver fora, o cadastro é afetado |
| Fila dedicada (ex.: RabbitMQ) | Mais um serviço para subir e manter, desnecessário para o tamanho do projeto |

## Consequências

**Positivas**

- O cadastro do livro não espera o e-mail.
- Sem novo componente: o Redis já estava no Docker Compose.
- Publicador e assinante não se conhecem, só combinam o nome do canal.
- Consultas frequentes ao catálogo deixam de ir ao MySQL a cada requisição.

**Negativas / riscos**

- O Pub/Sub do Redis **não guarda mensagens**: se o microsserviço estiver fora do ar quando o evento é publicado, o evento é perdido.
- Evolução possível: migrar para **Redis Streams**, que guarda as mensagens e permite reprocessar.