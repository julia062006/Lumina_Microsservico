# Runbook de Incidentes — Lumina

Este documento apresenta os procedimentos básicos para identificar, diagnosticar e recuperar falhas nos serviços do Lumina.

Os comandos devem ser executados na raiz do repositório, onde está localizado o `docker-compose.yml`. Antes de iniciar, verifique se o arquivo `.env` está configurado corretamente.

## 1. Identificação do problema

Caso o sistema apresente indisponibilidade, verifique o estado dos containers:

```bash
docker compose ps
```

Para visualizar também os containers que foram encerrados:

```bash
docker compose ps --all
```

Verifique se algum serviço apresenta estado `Exited`, `Restarting` ou `unhealthy`.

Para verificar o acesso à aplicação:

```bash
curl -kI https://lumina.local
```

## 2. Diagnóstico

Consulte os logs para identificar a origem da falha:

```bash
docker compose logs --tail=100
```

Para consultar um serviço específico:

```bash
docker compose logs --tail=100 NOME_DO_SERVICO
```

Os principais pontos a verificar são:

- **Backend:** conexão com MySQL e Redis, além das variáveis de ambiente necessárias.
- **Frontend:** falhas na construção da aplicação ou comunicação com o Nginx.
- **MySQL:** disponibilidade do banco de dados e estado do health check.
- **Redis:** disponibilidade do serviço e conexão com as aplicações.
- **Notificações:** conexão com o banco de dados, Redis e serviços dependentes.
- **Nginx:** disponibilidade dos certificados e comunicação com os serviços internos.

## 3. Recuperação dos serviços

Após identificar o serviço com problema, verifique a configuração do Compose:

```bash
docker compose config
```

Para reiniciar um serviço específico:

```bash
docker compose restart NOME_DO_SERVICO
```

Caso seja necessário reconstruir os serviços após alterações no código ou nas imagens:

```bash
docker compose up -d --build
```

Depois da recuperação, verifique novamente o estado dos containers:

```bash
docker compose ps
```

**Atenção:** não utilize `docker compose down -v` como procedimento de recuperação, pois esse comando remove volumes persistentes e pode causar perda de dados.

## 4. Falhas após atualização e rollback

Caso uma atualização provoque indisponibilidade, consulte os logs e identifique a última versão estável.

O projeto possui uma simulação conceitual de rollback na pipeline CI/CD, mas não implementa restauração automática de versões em um ambiente de produção.

Para retornar manualmente a uma versão anterior conhecida como estável:

```bash
git status
git log -5 --oneline
git switch --detach COMMIT_ESTAVEL
docker compose up -d --build
docker compose ps
```

Substitua `COMMIT_ESTAVEL` pelo identificador do commit correspondente à versão estável.

Esse procedimento reconstrói os serviços a partir do código anterior, mas não reverte alterações nos bancos de dados ou nos volumes persistentes.

Na pipeline, a variável `SIMULAR_FALHA` permite demonstrar dois cenários:

- `false`: simula uma atualização concluída com sucesso.
- `true`: simula uma falha no health check e registra um rollback conceitual, sem restaurar efetivamente os serviços.

## 5. Verificação final

Após realizar os procedimentos de recuperação, verifique se os serviços estão funcionando:

```bash
docker compose ps
```

Teste o acesso à aplicação:

```bash
curl -kI https://lumina.local
```

Verifique também os logs dos serviços recuperados:

```bash
docker compose logs --tail=50
```

A recuperação é considerada concluída quando os containers estão funcionando, a aplicação está acessível e não existem novas falhas nos logs dos serviços.

---

**Observação:** este Runbook deve ser atualizado sempre que houver mudanças relevantes na arquitetura, nos serviços ou nos procedimentos de implantação do Lumina.