# Resiliência

Resiliência é a capacidade do sistema de continuar funcionando, ou se recuperar, quando algo falha. Esta página lista o que o Lumina já faz e o que ainda não faz.

## Mecanismos implementados

| Mecanismo | Onde | Como funciona |
|---|---|---|
| Isolamento por microsserviço | Notificações | O envio de e-mail roda em container próprio; se ele falhar, o backend continua atendendo (ADR-001) |
| Comunicação assíncrona | Redis Pub/Sub | O backend publica o evento e segue; não espera o e-mail ser enviado (ADR-002) |
| Timeout na busca de destinatários | Microsserviço → backend | A chamada HTTP a `GET /internal/destinatarios` expira em 5 segundos, evitando espera infinita |
| Timeouts no envio de e-mail | Microsserviço → SMTP | Limites de 10 s (conexão), 10 s (saudação) e 30 s (socket) para não travar com o provedor lento |
| Nova tentativa (retry) | Microsserviço | O envio é tentado até 2 vezes, com espera de 2 segundos entre elas |
| Registro do resultado | `entregas_notificacao` | Cada entrega termina como `ENVIADA` ou `FALHOU`, com a mensagem de erro e o campo `tentativas` (gravado uma vez, ao registrar o resultado final) |
| Health check do Redis | Docker Compose | O Redis tem verificação de saúde configurada |
| Banco próprio do microsserviço | `notificacoes-db` | Uma falha no banco de notificações não afeta o banco do catálogo (ADR-003) |
| Bloqueio de rota interna | Nginx | `/api/internal/` não é exposta ao público e exige chave `x-api-key` |
| Pipeline com portão de qualidade | GitHub Actions | Código que falha no build ou na construção das imagens não chega ao deploy |

## Limitações conhecidas

- O **Pub/Sub do Redis não guarda mensagens**: se o microsserviço estiver fora do ar quando o evento é publicado, o aviso daquele livro é perdido. Evolução prevista: Redis Streams.
- **Circuit breaker não está implementado**: se o SMTP ficar fora por muito tempo, o sistema continua tentando em cada envio, em vez de interromper as tentativas por um período.
- O sistema roda em servidor único (Docker Compose), sem redundância de containers.
- A rota `GET /usuarios` (restrita ao administrador) pode retornar o hash da senha dos usuários. Correção prevista: excluir o campo `senha` na consulta do Sequelize.
- Os testes automatizados ainda não são executados pelo pipeline (falta o script `test` no `package.json`).

## Melhorias futuras

- Migrar o canal de eventos para Redis Streams, com reprocessamento de mensagens pendentes.
- Adicionar circuit breaker na chamada ao provedor de e-mail.
- Reprocessar automaticamente entregas com status `FALHOU`.
- Executar os testes automatizados no pipeline.