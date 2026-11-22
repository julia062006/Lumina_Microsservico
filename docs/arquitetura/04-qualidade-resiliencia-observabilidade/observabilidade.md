# Plano de Observabilidade

Observabilidade é a capacidade de entender o que está acontecendo dentro do sistema a partir do que ele registra. Os três pilares são **logs**, **métricas** e **rastreamento**. Esta página mostra o que existe hoje e o que está planejado.

## Logs

| Fonte | O que registra | Como consultar |
|---|---|---|
| Backend | Registros pontuais, como o uso do cache e a publicação do evento `livro.cadastrado` (não há log automático de todas as requisições) | `docker compose logs backend` |
| Microsserviço de notificações | Recebimento do evento, busca de destinatários, tentativas e resultado de cada envio | `docker compose logs notificacoes` |
| Nginx | Acessos e códigos de resposta | `docker compose logs nginx` |

A padronização dos logs do microsserviço está em andamento (tarefa LUM-63). O objetivo é que cada linha tenha data, nível (info, aviso ou erro) e uma mensagem clara.

## Métricas

As métricas vêm das fontes que já existem, sem ferramenta extra:

| Métrica | Fonte | Ligada ao SLO |
|---|---|---|
| Proporção de erros 5xx | Logs do Nginx | SLO 1 |
| Tempo de resposta do catálogo | Teste manual (planejado: registrar `$request_time` no log do Nginx) | SLO 2 |
| Cadastros concluídos com SMTP indisponível | Logs do Nginx (resposta do cadastro) e do microsserviço (falha de envio) | SLO 3 |
| Entregas `ENVIADA`, `FALHOU` e `PENDENTE`, com o erro de cada uma | Tabela `entregas_notificacao` | SLO 4 |

## Saúde dos serviços

- O Redis tem health check no Docker Compose.
- O estado dos containers pode ser verificado com `docker compose ps`.

## Alertas e rastreamento (planejado)

- Painel de métricas e alertas automáticos (por exemplo, com Prometheus e Grafana) quando o orçamento de erro for ultrapassado.
- Rastreamento distribuído (por exemplo, com OpenTelemetry) para acompanhar uma requisição desde o backend até o e-mail enviado.
- Identificador de correlação nos logs, ligando o evento de livro cadastrado ao envio das notificações.
- Log de requisições no backend (middleware) e registro do tempo de resposta no Nginx.

## Como investigar um problema

1. Ver o estado dos containers: `docker compose ps`.
2. Ler os logs do serviço suspeito: `docker compose logs NOME_DO_SERVICO`.
3. Se o problema for e-mail, consultar a tabela `entregas_notificacao` para ver o `status` e o `erro` de cada entrega.
4. Se for lentidão, medir o tempo de resposta de uma requisição de teste (por exemplo, no navegador).

O passo a passo completo está no `runbook.md`.