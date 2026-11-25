# Documento de Visão

---

## Identificação

| Campo | Valor |
|---|---|
| **Nome do projeto** | Treino Progressivo |
| **Grupo** | 2 |
| **Integrantes** | Arthur Munhon, Othavio Pedretti |
| **Disciplina** | Programação Web e Mobile |
| **Data de criação** | 01/09/26 |
| **Última atualização** | 23/11/26 |
| **Versão** | 1.1 |

---

## 1. Introdução

### 1.1 Propósito do documento

Este documento descreve a visão do Treino Progressivo: o problema que ele resolve, quem o usa, o que está e o que não está no escopo, e por que o produto tem um cliente web e um aplicativo mobile. Destina-se ao professor orientador e ao grupo, e serve de base para o PRD (`docs/prd.md`).

### 1.2 Escopo do produto

**O sistema irá:**
- Permitir que o personal trainer mantenha um catálogo de exercícios, cadastre seus alunos e monte fichas de treino com exercícios de força e de cardio
- Permitir que o aluno consulte a ficha no celular, execute o treino registrando carga e repetições de cada série e finalize a sessão
- Recalcular automaticamente a carga sugerida de cada exercício de força ao final da sessão (sobrecarga progressiva)
- Permitir que o aluno sem personal peça atendimento a um personal, e que o personal aceite ou recuse esse pedido
- Mostrar ao personal a evolução de carga de um aluno em cada exercício

**O sistema não irá (fora do escopo):**
- Cobrar mensalidade, agendar horários ou controlar a frequência na academia
- Prescrever treino automaticamente — quem monta a ficha é sempre o personal
- Enviar notificações push
- Permitir que um aluno tenha mais de um personal ao mesmo tempo
- Calcular progressão automática para exercícios de cardio

### 1.3 Definições e siglas

| Termo | Definição |
|---|---|
| Personal | Personal trainer: profissional que prescreve e acompanha o treino dos alunos |
| Ficha | Lista ordenada de exercícios prescrita pelo personal para um aluno |
| Item da ficha | Um exercício dentro da ficha, com a meta: séries, repetições e carga (força) ou duração, velocidade e inclinação (cardio) |
| Série | Uma execução contínua de um exercício de força, com uma carga e um número de repetições |
| Carga sugerida | Peso (kg) que o sistema recomenda para a próxima vez em que o aluno fizer aquele exercício |
| Sobrecarga progressiva | Princípio de aumentar a carga gradualmente conforme o aluno evolui; no sistema, ±5% calculados ao finalizar a sessão |
| Sessão de treino | Uma execução da ficha pelo aluno em uma data, do início à finalização |
| Solicitação | Pedido de um aluno sem personal para ser atendido por um personal específico |

---

## 2. Posicionamento

### 2.1 Declaração do problema

| Campo | Descrição |
|---|---|
| **O problema de** | controlar a evolução de carga dos alunos em planilhas, papel ou de memória |
| **Afeta** | personal trainers autônomos e os alunos que eles atendem |
| **Cujo impacto é** | histórico de carga perdido, ajuste de carga feito "no chute" e aluno que repete ou reduz o peso sem perceber que já tinha evoluído |
| **Uma solução adequada seria** | um sistema em que o personal monta a ficha, o aluno registra cada série no celular durante o treino, e a carga da próxima vez é calculada automaticamente a partir do que foi registrado |

### 2.2 Declaração de posição do produto

- **Para** personal trainers autônomos e seus alunos
- **Que** precisam saber, a cada treino, qual carga usar e se o aluno está evoluindo
- **O** Treino Progressivo
- **É** um sistema de prescrição e acompanhamento de treino, com cliente web e aplicativo mobile
- **Que** registra o treino no momento em que ele acontece e calcula a carga sugerida da próxima sessão
- **Diferente de** planilhas, cadernos e mensagens trocadas entre personal e aluno
- **Nosso produto** aplica a sobrecarga progressiva automaticamente, com uma regra única no servidor, e separa o trabalho de planejamento (web) do registro durante o treino (mobile)

---

## 3. Partes interessadas

| Parte interessada | Papel | Interesse no sistema |
|---|---|---|
| Personal trainer | Usuário do cliente web | Montar fichas rapidamente, organizar os alunos e acompanhar a evolução de cada um |
| Aluno | Usuário do aplicativo mobile | Saber o treino do dia e a carga a usar, registrar as séries com poucos toques e encontrar um personal |
| Professor da disciplina | Cliente e avaliador | Um produto que justifique os dois clientes, com regra de negócio no backend e contrato de API mantido |
| Grupo (Arthur e Othavio) | Desenvolvedores | Entregar backend, web e mobile integrados dentro do prazo das etapas |

---

## 4. Descrição dos usuários

### 4.1 Perfil: Personal trainer

| Campo | Descrição |
|---|---|
| **Descrição** | Profissional de educação física que atende vários alunos ao mesmo tempo |
| **Responsabilidades** | Manter o catálogo de exercícios, cadastrar alunos, aceitar novos alunos, montar e ajustar fichas, acompanhar a evolução |
| **Contexto de uso** | Sentado, em casa ou no escritório, no computador, com tempo para revisar dados de vários alunos |
| **Nível técnico** | Intermediário |
| **Frequência de uso** | Semanal (montagem e revisão de fichas) e eventual (novos alunos) |
| **Principal necessidade** | Visão de conjunto: montar fichas com vários exercícios e enxergar quem está evoluindo ou estagnado |

### 4.2 Perfil: Aluno

| Campo | Descrição |
|---|---|
| **Descrição** | Pessoa que treina na academia seguindo a ficha do personal |
| **Responsabilidades** | Executar o treino, registrar carga e repetições de cada série, finalizar a sessão, pedir atendimento a um personal quando ainda não tem um |
| **Contexto de uso** | Em pé, na academia, com o celular em uma mão entre uma série e outra, pouco tempo e às vezes conexão instável |
| **Nível técnico** | Básico |
| **Frequência de uso** | Diário, em todo dia de treino |
| **Principal necessidade** | Ver o treino do dia com a carga já sugerida e registrar cada série em poucos toques |

---

## 5. Visão geral do produto

### 5.1 Perspectiva do produto

É um sistema independente, que substitui o controle manual (planilhas, cadernos e mensagens) usado hoje por personals autônomos. Tem três componentes: uma API REST (NestJS + PostgreSQL) que concentra toda a regra de negócio, um cliente web (Next.js) para o personal e um aplicativo mobile (Flutter) para o aluno. Não integra com sistemas externos.

### 5.2 Por que dois clientes

**O que acontece na tela grande, e por quê:** o trabalho do personal — cadastro de exercícios e alunos, montagem e edição de fichas, decisão sobre solicitações e análise da evolução de carga. São tarefas de planejamento, feitas sentado, que exigem ver muitos dados ao mesmo tempo (vários exercícios com ordem e metas, vários alunos, um gráfico ao longo de semanas).

**O que acontece no celular, e por quê:** o treino do aluno — ver a ficha do dia, iniciar a sessão, registrar carga e repetições série a série e finalizar. Isso só faz sentido na academia, com o celular na mão entre séries; nenhum aluno leva um computador para a academia. Também é pelo celular que o aluno pede atendimento a um personal.

**O que faz sentido existir nos dois:** a consulta da ficha (o aluno para treinar, o personal para revisar o que montou) e o fluxo de solicitação, que começa no celular (o aluno pede) e termina no web (o personal decide).

### 5.3 Capacidades principais

| # | Capacidade | Descrição resumida | Cliente principal |
|---|---|---|---|
| C01 | Gestão de alunos e catálogo | Cadastro de exercícios e de alunos pelo personal | web |
| C02 | Montagem de fichas | Fichas com itens de força e cardio, do catálogo ou com nome personalizado | web |
| C03 | Execução de treino | Iniciar sessão, registrar séries e finalizar | mobile |
| C04 | Sobrecarga progressiva | Recálculo automático da carga sugerida ao finalizar a sessão | backend (resultado visto nos dois) |
| C05 | Solicitações de atendimento | Aluno pede atendimento a um personal; personal aceita ou recusa | ambos |
| C06 | Acompanhamento da evolução | Histórico de carga por exercício (web) e das últimas sessões (mobile) | ambos |

### 5.4 Suposições e dependências

**Suposições:**
- O aluno tem um smartphone Android e acesso à internet na academia, ainda que instável
- O personal usa um computador para planejar os treinos
- A regra de ±5% de sobrecarga progressiva é adequada para todos os exercícios de força do MVP

**Dependências:**
- PostgreSQL 18 acessível pela `DATABASE_URL` (Docker Compose no desenvolvimento)
- Backend no ar para os dois clientes funcionarem — os clientes não acessam o banco
- Emulador Android ou aparelho na mesma rede do backend para o app mobile

---

## 6. Restrições

| Tipo | Restrição |
|---|---|
| Backend | NestJS + Prisma 7 + PostgreSQL 18 |
| Cliente web | React 19 + Next.js com App Router |
| Cliente mobile | Flutter 3 / Dart |
| Autenticação | JWT com guards no backend e sessão completa no cliente web; no app mobile o login é simulado (só e-mail, sem token), conforme orientação do professor em aula |
| Arquitetura | Regra de negócio no backend; clientes não acessam o banco |
| Controle de versão | Repositório único do grupo no GitHub, criado a partir do repositório-modelo da disciplina |
| Prazo | Etapas 0 a 5 conforme o calendário da turma, mais apresentação |
| Documentação | Markdown, versionada no mesmo repositório |
| Equipe | Dois integrantes para três componentes: cada um lidera um cliente e os dois trabalham no backend |

---

## 7. Qualidade

| Atributo | Relevância para este sistema |
|---|---|
| Usabilidade com uma mão (mobile) | O aluno registra séries entre um exercício e outro, cansado e com pouco tempo; cada registro precisa de poucos toques |
| Tolerância a conexão instável (mobile) | Academias costumam ter sinal fraco; o app não pode perder o que o aluno já preencheu e precisa dizer claramente se o problema é conexão, demora ou erro do servidor |
| Consistência entre clientes | A ficha montada no web precisa aparecer igual no celular, e a carga recalculada precisa ser a mesma nos dois — por isso o cálculo fica só no backend |
| Segurança dos dados do personal | Cada personal só vê os próprios alunos e solicitações; senhas guardadas com hash |

---

## 8. Histórico de revisões

| Versão | Data | Autor | Descrição da alteração |
|---|---|---|---|
| 1.0 | 01/09/26 | Arthur Munhon | Versão inicial (identificação) |
| 1.1 | 23/11/26 | Arthur Munhon | Documento preenchido a partir do PRD; inclui solicitações de atendimento, itens de cardio e login simulado no mobile |
