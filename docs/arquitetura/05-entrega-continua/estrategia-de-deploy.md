# Estratégia de Deploy e CI/CD

## Visão geral

O Lumina roda em containers orquestrados por **Docker Compose** (frontend, backend, microsserviço de notificações, bancos MySQL, Redis e Nginx). O pipeline de CI/CD fica em `.github/workflows/pipeline.yaml` ("Lumina CI/CD") e roda no GitHub Actions a cada push ou pull request na branch `main`.

## Etapas do pipeline

| Etapa | O que faz |
|---|---|
| 1. Build | Instala as dependências (Node 20) e compila o backend e o microsserviço |
| 2. Test | Executa `npm test --if-present` no backend. Existem testes no código, mas o `package.json` ainda não define o script `test`, então o pipeline não os executa e a etapa é um esqueleto |
| 3. Docker | Cria um `.env` de teste, valida o `docker-compose.yml` com `docker compose config` e constrói as imagens com `docker compose build` |
| 4. Deploy (simulado) | Roda somente em push na `main` e só simula a publicação |

Cada etapa só começa se a anterior passar. Código que falha no build ou na construção das imagens não chega ao deploy (os testes ainda não bloqueiam o pipeline, pelo motivo descrito na etapa 2).

## Deploy simulado e falha controlada

A etapa de deploy não publica em servidor real. Ela serve para demonstrar o fluxo completo:

- Com tudo certo, o deploy simulado percorre os passos (registrar a versão atual, preparar as novas imagens, simular a atualização e o health check do backend) e conclui com sucesso.
- A variável do repositório `SIMULAR_FALHA`, quando `true`, faz a etapa falhar de propósito (encerra com erro), para demonstrar o comportamento em caso de problema.
- O rollback no pipeline é **conceitual**: ele mostra a ideia, sem restaurar nada de fato.

## Estratégia de implantação

A estratégia adotada é a **implantação simples (recreate)**: os containers são recriados com a nova versão. É adequada ao porte do projeto, que roda em servidor único e não tem requisito de zero downtime.

Alternativas como **blue-green** ou **canary** exigiriam duas instâncias em paralelo e um balanceador, o que seria excesso de complexidade para este projeto.

## Rollback real (manual)

Em caso de problema, o rollback é feito manualmente, conforme o `runbook.md`:

1. Identificar o último commit estável (`COMMIT_ESTAVEL`).
2. Voltar o código para ele: `git switch --detach COMMIT_ESTAVEL`.
3. Recriar os containers: `docker compose up -d --build`.
4. Verificar o funcionamento com `docker compose ps` e os logs.

## Próximos passos

- Criar o script `test` no `package.json` para o pipeline executar os testes já existentes e bloquear o deploy em caso de falha.
- Trocar o deploy simulado por um deploy real em servidor, com rollback automático.
- Publicar as imagens em um registro de containers e versioná-las por tag.