# SLIs e SLOs

**SLI** (indicador) é o que medimos. **SLO** (objetivo) é a meta que queremos atingir para esse indicador. Os valores abaixo são metas propostas para o Lumina, adequadas ao porte do projeto.

| # | Objetivo | SLI (o que medimos) | SLO (meta) | Como medir |
|---|---|---|---|---|
| 1 | Disponibilidade do site e da API | Proporção de requisições que não retornam erro 5xx | 99% das requisições por mês | Logs de acesso do Nginx |
| 2 | Rapidez na consulta ao catálogo | Tempo de resposta da lista de livros e do livro por ID | 95% das requisições em até 500 ms | Teste manual de requisições (o log do Nginx ainda não registra a duração) |
| 3 | Cadastro independente do e-mail | Proporção de cadastros de livro concluídos com sucesso, mesmo com o SMTP indisponível | 99% dos cadastros | Logs do Nginx (resposta do cadastro) e do microsserviço (resultado do e-mail) |
| 4 | Entrega das notificações | Proporção de entregas com status `ENVIADA` sobre o total de entregas | 95% das entregas enviadas | Tabela `entregas_notificacao` (campo `status`) |

## Orçamento de erro

Com o SLO de 99% de disponibilidade, o sistema pode falhar em até 1% das requisições no mês. Se esse limite for ultrapassado, a prioridade passa a ser corrigir a causa antes de lançar novas funcionalidades.

## Observações

- O SLO 3 decorre da decisão do ADR-001 (microsserviço separado) e do cenário QS-01.
- O SLO 4 é medido por destinatário, pois o status fica em cada entrega.
- As metas podem ser revistas conforme o uso real do sistema.