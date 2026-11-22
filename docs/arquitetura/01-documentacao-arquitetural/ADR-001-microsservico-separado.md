# ADR-001: Microsserviço separado para notificações

- **Status:** Aceito
- **Data:** 22/11/2026
- **Decisores:** Equipe do projeto Lumina

## Contexto

Quando um livro é cadastrado, o sistema precisa avisar os usuários por e-mail. O envio de e-mail é lento e pode falhar (o provedor de SMTP pode estar fora do ar ou demorar para responder). Isso não deve impedir nem atrasar o cadastro do livro.

## Decisão

Criar um microsserviço separado em NestJS (`Lumina_Microsservico/notificacoes`), rodando no seu próprio container. O backend apenas publica um evento quando o livro é cadastrado, e o microsserviço cuida de buscar os destinatários e enviar os e-mails.

## Alternativas consideradas

| Alternativa | Motivo da rejeição |
|---|---|
| Manter tudo no backend (monólito) | O envio de e-mail ficaria preso ao fluxo de cadastro, e uma falha no SMTP afetaria o backend |
| Transformar todo o sistema em microsserviços | Complexidade desnecessária para o tamanho do projeto |

## Consequências

**Positivas**

- O cadastro de livros não depende do envio de e-mail.
- O microsserviço pode falhar ou reiniciar sem derrubar o backend.

**Negativas / riscos**

- Mais containers e um banco de dados a mais (`notificacoes-db`) para manter.
- Precisa de um mecanismo de comunicação entre os serviços (ver ADR-002).