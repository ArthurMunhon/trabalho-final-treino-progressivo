# Equipe — composição e registro de contribuições

> O registro aqui não substitui o histórico do Git; ele **explica** o histórico. Trabalho que não aparece em commit (modelagem, decisão de arquitetura, depuração de um bug do colega) é exatamente o que este arquivo serve para tornar visível.
>
> Os campos marcados com _(a preencher)_ dependem de informação que só o grupo tem (datas das etapas, combinados, dificuldades) e devem ser completados pelos integrantes.

---

## 1. Identificação

| Campo | Valor |
|---|---|
| **Projeto** | Treino Progressivo |
| **Grupo** | 2 |
| **Tema escolhido** | Prescrição de treino e sobrecarga progressiva: o personal monta a ficha no web e o aluno registra o treino no celular |
| **Repositório** | `https://github.com/ArthurMunhon/trabalho-final-treino-progressivo` |
| **Data de formação** | 01/09/26 |

---

## 2. Integrantes e papéis

**Grupo de 2** — cada um lidera um cliente; backend e contrato são conduzidos em conjunto:

| Integrante | Usuário GitHub | Responsabilidade principal | Parte do backend que conduz |
|---|---|---|---|
| Othavio Pedretti | `Othavio-Pedretti` | Cliente web | Autenticação do personal (JWT, `PersonalModule`, guard), filtro de alunos por personal, seed, solicitações (`SolicitacoesModule`), itens de cardio |
| Arthur Munhon | `ArthurMunhon` | App mobile | Estrutura inicial do NestJS, integração do Prisma 7, CRUDs do MVP (exercícios, alunos, fichas, sessões e sobrecarga progressiva), login simulado do app (`AppAlunoModule`) |

> **Responsabilidade principal** significa liderar aquele componente: tomar as decisões, revisar o que os colegas commitam ali e responder por ele na apresentação. Não significa ser o único a escrever código naquela pasta.

---

## 3. Combinados do grupo

| Tema | Combinado |
|---|---|
| Frequência de reuniões | Sem reuniões marcadas; as conversas e os combinados foram feitos pelo WhatsApp, conforme a necessidade |
| Canal de comunicação | WhatsApp |
| Prazo interno antes do prazo oficial do checkpoint | _(a preencher)_ |
| Como a revisão de código acontece | Commits direto na `main`; cada um revisa o que o outro mexeu no backend ao fazer `pull` |
| Como avisar mudança no contrato da API | Atualizar `docs/contrato-api.md` (com entrada no histórico de revisões) e avisar o colega no mesmo dia |
| O que fazer quando alguém trava por mais de um dia | Perguntar para o outro pelo WhatsApp |

---

## 4. Registro por etapa

---

### Etapa 0 — Concepção

**Período:** 01/09/26

| Integrante | O que fez | Commits / PRs de referência |
|---|---|---|
| Arthur Munhon | Criação do repositório a partir do modelo da disciplina | `9066af4` |
| Othavio Pedretti | _(a preencher)_ | — |

**Dificuldades de coordenação:** alinhar as ideias dos dois sobre o tema e o tamanho do escopo.

**Ajustes combinados para a próxima etapa:** cada um lidera um cliente (Othavio o web, Arthur o mobile) e o backend é feito pelos dois.

---

### Etapa 1 — Contrato e fundação

**Período:** 01/09/26 a 12/09/26

| Integrante | O que fez | Componentes tocados | Commits / PRs de referência |
|---|---|---|---|
| Arthur Munhon | Estrutura inicial do backend NestJS; schema do banco e integração do Prisma 7 com `@prisma/adapter-pg` | backend | `8398cd8`, `3704903` |
| Othavio Pedretti | _(a preencher)_ | | |

**Dificuldades de coordenação:** coordenar as ideias para o modelo de dados e o contrato antes de começar o código.

**Ajustes combinados para a próxima etapa:** mudança no contrato da API é registrada no `docs/contrato-api.md` e avisada ao colega.

---

### Etapa 2 — Backend · Checkpoint 1

**Período:** 13/09/26 a 23/10/26

| Integrante | O que fez | Componentes tocados | Commits / PRs de referência |
|---|---|---|---|
| Arthur Munhon | CRUDs do MVP (exercícios, alunos, fichas e itens, sessões de treino, séries e finalização com sobrecarga progressiva); Prisma movido para dentro do backend | backend, docs | `6a8cdc9` |
| Othavio Pedretti | Login do personal com JWT (`/personal/register`, `/personal/login`), guard de token, alunos filtrados pelo personal do token, seed | backend | `f7ca2c8`, `5cf1dae`, `dd95ebb`, `3506076`, `c2211cc` |

**Como a revisão de código aconteceu nesta etapa:** cada um revisou a própria parte. O Arthur olhava de vez em quando o backend que o Othavio fazia, ao dar `pull`.

**Dificuldades de coordenação:** coordenar as ideias da autenticação. O contrato 1.0 previa um `POST /auth/login` único, e o backend ficou com `/personal/login` e `/personal/register`; o contrato só foi acertado na versão 1.2.

**Ajustes combinados para a próxima etapa:** o web começa em paralelo, usando as rotas que já existiam.

---

### Etapa 3 — Cliente web · Checkpoint 2

**Período:** 25/09/26 a 24/11/26 (começou junto com o fim do backend)

| Integrante | O que fez | Componentes tocados | Commits / PRs de referência |
|---|---|---|---|
| Othavio Pedretti | Projeto web; páginas de login, cadastro, alunos, fichas e treinos; sessão em cookie `httpOnly` e bloqueio das páginas sem login; montagem de fichas com itens de cardio; detalhe e exclusão de aluno; solicitações pendentes (aceitar/recusar) no web e no backend | web, backend | `89870ff`, `bff4101`, `709d455`, `ad3816f`, `70773b8`, `a3e67b1`, `71902ce`, `af40979`, `9801260`, `c63c927` |
| Arthur Munhon | Revisou, depois do `pull`, as mudanças de backend feitas para o web (`/solicitacoes` e `Aluno.personalId` opcional) para conferir o impacto no app | backend (revisão) | — |

**Como a revisão de código aconteceu nesta etapa:** cada um revisou a própria parte. O Arthur não mexeu no web e olhou as mudanças de backend feitas para ele depois do `pull`.

**Dificuldades de coordenação:** coordenar as ideias que surgiram no web e mexiam no backend (solicitações, cardio, aluno sem personal) com o que o mobile ia precisar.

**Ajustes combinados para a próxima etapa:** o mobile usa as mesmas rotas de fichas e sessões que o web já usava.

---

### Etapa 4 — App mobile · Checkpoint 3

**Período:** de 12/11/26 a 26/11/26

| Integrante | O que fez | Componentes tocados | Commits / PRs de referência |
|---|---|---|---|
| Arthur Munhon | Projeto Flutter; modelos e dados mock; tela da ficha e registro de treino; rota `POST /app/login` no backend; `TreinoApi` (cliente HTTP com falhas tipadas), tela de login e reorganização em `screens/` e `widgets/`; ficha vinda da API; semana do aluno com a ficha de cada dia; registro de treino pela API com sobrecarga progressiva e testes com `MockClient`; retomada da sessão em andamento; botões de + e − na carga e nas repetições; tema escuro igual ao web e botão de sair; atualização de PRD, contrato, visão, equipe, relatório e README | mobile, backend, docs | `15eb1dc`, `717fda9`, `bfa9437`, `763ad88`, `495b140`, `67e71bb`, `7727c4a`, `23b3c75`, `586bdaf`, `d7f67f3`, `b84ed63`, `6e104d9`, `14452ba`, `33f1434`, `91e21ba`, `2e7f318` |
| Othavio Pedretti | _(a preencher)_ | | |

**Como a revisão de código aconteceu nesta etapa:** o Arthur revisou as mudanças de backend do Othavio (`9801260`) antes de criar a rota do app, para confirmar que nada afetava o mobile.

**Dificuldades de coordenação:** coordenar as mudanças que vieram do web (fichas por dia da semana) com o que o app já fazia. A solicitação pelo app acabou ficando de fora.

**Ajustes combinados para a próxima etapa:** definir como nasce a conta do aluno sem personal (RF-064) e quem implementa o `POST /solicitacoes` do lado do aluno.

---

### Etapa 5 — Integração e fechamento

**Período:** a partir de 26/11/26 até a entrega

| Integrante | O que fez | Componentes tocados | Commits / PRs de referência |
|---|---|---|---|
| | | | |
| | | | |

**Como a revisão de código aconteceu nesta etapa:** cada um revisou a própria parte. O Othavio não mexeu no mobile e o Arthur não mexeu no web.

**Dificuldades de coordenação:** coordenar as ideias do que entraria na entrega e do que ficaria de fora (solicitação pelo app, histórico no mobile, registro de cardio).

---

## 5. Cobertura por componente

> Número aproximado de commits que tocaram cada pasta, levantado com `git log -- <pasta>` em 26/11/26. Atualizar na entrega final.

| Integrante | Backend | Web | Mobile | Cumpre a regra dos dois componentes? |
|---|---|---|---|---|
| Arthur Munhon | 3 | 0 | 15 | Sim (backend + mobile) |
| Othavio Pedretti | 12 | 13 | 0 | Sim (backend + web) |

---

## 6. Ocorrências

| Data | Ocorrência | Encaminhamento | Professor comunicado? |
|---|---|---|---|
| 19/11/26 | O professor deixou de exigir token no app mobile | Grupo adotou login simulado por e-mail (`POST /app/login`); contrato 1.2 e PRD 1.1 atualizados | Orientação veio do próprio professor, em aula |

---

## 7. Autoavaliação do grupo

> Preencha na Etapa 5, em conjunto.

**O que funcionou na divisão de trabalho:** cada um liderar um cliente e os dois fazerem o backend. Ficou claro quem respondia por cada parte, e quando alguém travava perguntava para o outro e resolvia rápido.

**O que não funcionou:** sem reuniões marcadas, algumas ideias foram alinhadas tarde e o contrato mudou durante o projeto. A revisão ficou mais em cada um olhar a própria parte.

**Se recomeçassem, o que dividiriam de outro jeito:** começariam o mobile mais cedo, junto com o web, e fechariam o contrato numa conversa no início de cada etapa antes de codar.
