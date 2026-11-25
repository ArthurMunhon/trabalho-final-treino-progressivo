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
| Frequência de reuniões | _(a preencher)_ |
| Canal de comunicação | _(a preencher)_ |
| Prazo interno antes do prazo oficial do checkpoint | _(a preencher)_ |
| Como a revisão de código acontece | Commits direto na `main`; cada um revisa o que o outro mexeu no backend ao fazer `pull` |
| Como avisar mudança no contrato da API | Atualizar `docs/contrato-api.md` (com entrada no histórico de revisões) e avisar o colega no mesmo dia |
| O que fazer quando alguém trava por mais de um dia | _(a preencher)_ |

---

## 4. Registro por etapa

---

### Etapa 0 — Concepção

**Período:** _(a preencher)_

| Integrante | O que fez | Commits / PRs de referência |
|---|---|---|
| Arthur Munhon | Criação do repositório a partir do modelo da disciplina | `9066af4` |
| Othavio Pedretti | _(a preencher)_ | — |

**Dificuldades de coordenação:** _(a preencher)_

**Ajustes combinados para a próxima etapa:** _(a preencher)_

---

### Etapa 1 — Contrato e fundação

**Período:** _(a preencher)_

| Integrante | O que fez | Componentes tocados | Commits / PRs de referência |
|---|---|---|---|
| Arthur Munhon | Estrutura inicial do backend NestJS; schema do banco e integração do Prisma 7 com `@prisma/adapter-pg` | backend | `8398cd8`, `3704903` |
| Othavio Pedretti | _(a preencher)_ | | |

**Dificuldades de coordenação:** _(a preencher)_

**Ajustes combinados para a próxima etapa:** _(a preencher)_

---

### Etapa 2 — Backend · Checkpoint 1

**Período:** _(a preencher)_

| Integrante | O que fez | Componentes tocados | Commits / PRs de referência |
|---|---|---|---|
| Arthur Munhon | CRUDs do MVP (exercícios, alunos, fichas e itens, sessões de treino, séries e finalização com sobrecarga progressiva); Prisma movido para dentro do backend | backend, docs | `6a8cdc9` |
| Othavio Pedretti | Login do personal com JWT (`/personal/register`, `/personal/login`), guard de token, alunos filtrados pelo personal do token, seed | backend | `f7ca2c8`, `5cf1dae`, `dd95ebb`, `3506076`, `c2211cc` |

**Como a revisão de código aconteceu nesta etapa:** _(a preencher)_

**Dificuldades de coordenação:** _(a preencher)_

**Ajustes combinados para a próxima etapa:** _(a preencher)_

---

### Etapa 3 — Cliente web · Checkpoint 2

**Período:** _(a preencher)_

| Integrante | O que fez | Componentes tocados | Commits / PRs de referência |
|---|---|---|---|
| Othavio Pedretti | Projeto web; páginas de login, cadastro, alunos, fichas e treinos; sessão em cookie `httpOnly` e bloqueio das páginas sem login; montagem de fichas com itens de cardio; detalhe e exclusão de aluno; solicitações pendentes (aceitar/recusar) no web e no backend | web, backend | `89870ff`, `bff4101`, `709d455`, `ad3816f`, `70773b8`, `a3e67b1`, `71902ce`, `af40979`, `9801260`, `c63c927` |
| Arthur Munhon | _(a preencher)_ | | |

**Como a revisão de código aconteceu nesta etapa:** _(a preencher)_

**Dificuldades de coordenação:** _(a preencher)_

**Ajustes combinados para a próxima etapa:** _(a preencher)_

---

### Etapa 4 — App mobile · Checkpoint 3

**Período:** de 12/11/26 a _(em andamento)_

| Integrante | O que fez | Componentes tocados | Commits / PRs de referência |
|---|---|---|---|
| Arthur Munhon | Projeto Flutter; modelos e dados mock; tela da ficha e registro de treino; rota `POST /app/login` no backend; `TreinoApi` (cliente HTTP com falhas tipadas), tela de login e reorganização em `screens/` e `widgets/`; atualização de PRD, contrato, visão, equipe e relatório | mobile, backend, docs | `15eb1dc`, `717fda9`, `bfa9437`, `763ad88`, `495b140`, `67e71bb` |
| Othavio Pedretti | _(a preencher)_ | | |

**Como a revisão de código aconteceu nesta etapa:** o Arthur revisou as mudanças de backend do Othavio (`9801260`) antes de criar a rota do app, para confirmar que nada afetava o mobile.

**Dificuldades de coordenação:** _(a preencher)_

**Ajustes combinados para a próxima etapa:** definir como nasce a conta do aluno sem personal (RF-064) e quem implementa o `POST /solicitacoes` do lado do aluno.

---

### Etapa 5 — Integração e fechamento

**Período:** _(a preencher)_

| Integrante | O que fez | Componentes tocados | Commits / PRs de referência |
|---|---|---|---|
| | | | |
| | | | |

**Como a revisão de código aconteceu nesta etapa:** _(a preencher)_

**Dificuldades de coordenação:** _(a preencher)_

---

## 5. Cobertura por componente

> Número aproximado de commits que tocaram cada pasta, levantado com `git log -- <pasta>` em 23/11/26. Atualizar na entrega final.

| Integrante | Backend | Web | Mobile | Cumpre a regra dos dois componentes? |
|---|---|---|---|---|
| Arthur Munhon | 6 | 2 | 4 | Sim (backend + mobile) |
| Othavio Pedretti | 10 | 12 | 0 | Sim (backend + web) |

---

## 6. Ocorrências

| Data | Ocorrência | Encaminhamento | Professor comunicado? |
|---|---|---|---|
| _(data da aula)_ | O professor deixou de exigir token no app mobile | Grupo adotou login simulado por e-mail (`POST /app/login`); contrato 1.2 e PRD 1.1 atualizados | Orientação veio do próprio professor, em aula |

---

## 7. Autoavaliação do grupo

> Preencha na Etapa 5, em conjunto.

**O que funcionou na divisão de trabalho:**

**O que não funcionou:**

**Se recomeçassem, o que dividiriam de outro jeito:**
