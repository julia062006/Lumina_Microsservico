# Cenários de Qualidade

Cada cenário descreve um atributo de qualidade de forma testável: quem ou o que causa o evento (fonte), o que acontece (estímulo), em que situação (ambiente), qual parte do sistema é afetada (artefato), como o sistema reage (resposta) e como verificamos (medida).

## QS-01: Disponibilidade, e-mail fora do ar não bloqueia o cadastro

| Elemento | Descrição |
|---|---|
| Fonte | Provedor de e-mail (SMTP) |
| Estímulo | O provedor fica indisponível ou lento |
| Ambiente | Operação normal, administrador cadastrando um livro |
| Artefato | Microsserviço de notificações |
| Resposta | O livro é cadastrado normalmente; o microsserviço respeita os timeouts, tenta o envio novamente (2 tentativas no total) e registra a falha em log |
| Medida | O cadastro do livro conclui com sucesso, independentemente do estado do SMTP |

## QS-02: Resiliência, microsserviço fora do ar não derruba o backend

| Elemento | Descrição |
|---|---|
| Fonte | Falha interna (container do microsserviço parado ou reiniciando) |
| Estímulo | O microsserviço de notificações fica indisponível |
| Ambiente | Operação normal |
| Artefato | Backend e Redis |
| Resposta | O backend continua atendendo leitores e administrador; o container do microsserviço pode ser reiniciado sem afetar os demais serviços |
| Medida | Catálogo e cadastro continuam funcionando; somente os avisos por e-mail deixam de ser enviados enquanto o serviço estiver fora (limitação conhecida: o Pub/Sub não guarda o evento, então os avisos publicados nesse período são perdidos, ver ADR-002) |

## QS-03: Desempenho, consultas repetidas ao catálogo

| Elemento | Descrição |
|---|---|
| Fonte | Leitores acessando o site |
| Estímulo | Várias requisições seguidas à lista de livros ou a um mesmo livro |
| Ambiente | Operação normal |
| Artefato | Backend e cache Redis |
| Resposta | As consultas repetidas são atendidas pelo cache, sem ir ao MySQL |
| Medida | Dentro do TTL (300 s para listas e destaques, 600 s para livro por ID) as respostas vêm do cache; após cadastro, edição ou remoção de livro o cache é invalidado |

## QS-04: Segurança, rotas internas não são expostas

| Elemento | Descrição |
|---|---|
| Fonte | Usuário externo mal-intencionado |
| Estímulo | Tentativa de acessar a rota interna de destinatários pela internet |
| Ambiente | Sistema em operação, acesso via Nginx |
| Artefato | Nginx e backend |
| Resposta | O Nginx bloqueia `/api/internal/`; a rota interna também exige a chave `x-api-key` |
| Medida | Requisições externas a `/api/internal/` não retornam dados |

## QS-05: Manutenibilidade e entrega, falha no pipeline não vai para o ar

| Elemento | Descrição |
|---|---|
| Fonte | Desenvolvedora |
| Estímulo | Envia código que quebra o build ou a construção das imagens |
| Ambiente | Push ou pull request na branch `main` |
| Artefato | Pipeline de CI/CD (GitHub Actions) |
| Resposta | O pipeline falha na etapa correspondente e não chega ao deploy |
| Medida | Só código que passa pelo build e pela construção das imagens Docker avança (os testes automatizados ainda não são executados pelo pipeline); em caso de problema em produção, o rollback segue o runbook |