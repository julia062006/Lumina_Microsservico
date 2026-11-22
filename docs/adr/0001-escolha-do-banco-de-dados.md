# ADR 0001: Escolha do banco de dados

- **Status:** Aceito
- **Data:** 21/11/2026
- **Decisores:** Equipe do projeto Lumina

## Contexto

O Lumina é um sistema de gerenciamento e divulgação de livros, composto por um backend (Express, TypeScript e Sequelize) e um microsserviço de notificações por e-mail (NestJS). O sistema trabalha com entidades fortemente relacionadas: livros, autores, categorias, editoras, coleções e usuários. Um livro pertence a um autor, a uma categoria e a uma editora, e pode pertencer a uma coleção.

Os principais requisitos que influenciam a escolha são:

- Consultas que cruzam entidades, como listar livros por categoria ou coleção e exibir livros em destaque.
- Integridade dos dados (um livro não pode apontar para um autor inexistente).
- Equipe pequena, prazo curto e custo de hospedagem baixo.
- Compatibilidade com o Sequelize, o ORM já adotado no projeto.

## Decisão

Adotar o **MySQL** como banco de dados relacional principal.

O **Redis** é mantido como complemento, e não como banco de dados principal. Ele atua como cache de consultas frequentes e como canal de Pub/Sub para a comunicação entre o backend e o microsserviço de notificações (evento de novo livro cadastrado).

## Alternativas consideradas

| Alternativa | Vantagens | Motivo da rejeição |
|---|---|---|
| **PostgreSQL** | Muito robusto, recursos avançados, bom suporte no Sequelize | Seus recursos extras (tipos avançados, extensões) não são necessários para o escopo atual, e a equipe já tem familiaridade com o MySQL |
| **MongoDB** | Esquema flexível, boa escalabilidade horizontal | Os dados são relacionais e dependem de integridade referencial e joins. Em um banco de documentos isso exigiria duplicação de dados ou controle manual de consistência |
| **SQLite** | Simples, sem servidor | Não atende a acessos concorrentes nem a um cenário de produção com múltiplos serviços |

## Consequências

**Positivas**
- O modelo relacional representa naturalmente as relações entre livros, autores, categorias, editoras e coleções.
- Chaves estrangeiras garantem a integridade dos dados.
- O Sequelize oferece suporte maduro ao MySQL (models, associações e migrations).
- Tecnologia amplamente conhecida, com documentação abundante e hospedagem barata.
- O Redis reduz a carga sobre o MySQL nas consultas mais frequentes.

**Negativas / riscos**
- A escalabilidade é predominantemente vertical. Para um volume muito maior seria preciso planejar réplicas de leitura.
- Mudanças de esquema exigem migrations e cuidado com os dados existentes.
- O cache no Redis introduz o risco de dados desatualizados, tratado com invalidação ao cadastrar, editar ou remover livros.
- O Redis precisa estar disponível para o Pub/Sub. A indisponibilidade dele afeta as notificações, mas não o cadastro de livros no MySQL.

## Revisão

Esta decisão deve ser reavaliada se o volume de dados ou de acessos crescer de forma que o MySQL em servidor único deixe de atender.