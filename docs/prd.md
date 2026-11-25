# PRD — Product Requirements Document

> O contrato da API vive em documento separado: [`docs/contrato-api.md`](contrato-api.md). Este PRD define **o que** o sistema faz; o contrato define **como** os clientes conversam com ele.

---

## Identificação

| Campo | Valor |
|---|---|
| **Nome do projeto** | Treino Progressivo |
| **Grupo** | 2 |
| **Versão do documento** | 1.1 |
| **Data de criação** | 2026-09-12 |
| **Última atualização** | 2026-11-23 |
| **Documento de Visão (ref.)** | `docs/visao.md` |
| **Contrato da API (ref.)** | `docs/contrato-api.md` |

---

## 1. Objetivo do produto

O Treino Progressivo permite que um personal trainer monte fichas de treino para seus alunos e acompanhe a evolução de carga de cada exercício ao longo do tempo, enquanto o aluno executa o treino do dia e registra o que fez direto do celular na academia. O sistema calcula automaticamente a sobrecarga progressiva — o quanto a carga sugerida deve subir, manter ou cair na próxima sessão — a partir do desempenho registrado, eliminando o controle manual em planilha ou papel. O aluno que ainda não tem personal pode pedir para ser atendido por um, e o personal decide pelo web se aceita.

---

## 2. Personas

### Persona 1 — Fernanda

- **Contexto:** personal trainer autônoma, atende cerca de 15 alunos, planeja as fichas em casa ou no escritório, sentada, com tempo para revisar dados.
- **Cliente principal:** web
- **Objetivo principal no sistema:** montar fichas de treino consistentes e enxergar se um aluno está evoluindo de carga ou estagnado, sem precisar cruzar planilhas.
- **Maior frustração atual (sem o sistema):** perde o histórico de carga dos alunos em anotações soltas e decide o ajuste de carga "no chute" a cada novo ciclo.
- **Critério de sucesso:** consegue montar uma ficha nova em poucos minutos e ver a evolução de carga de um aluno em um exercício específico sem perguntar a ele.

### Persona 2 — Marcos

- **Contexto:** aluno, treina na academia, com o celular em mãos entre uma série e outra, sem tempo nem paciência para preencher formulários longos.
- **Cliente principal:** mobile
- **Objetivo principal no sistema:** saber o treino do dia e registrar rapidamente carga e repetições de cada série, sem precisar lembrar disso depois em casa.
- **Maior frustração atual (sem o sistema):** esquece a carga usada na última vez e acaba repetindo ou reduzindo o peso sem perceber que já tinha evoluído.
- **Critério de sucesso:** abre o app, vê o treino do dia com a carga sugerida já calculada, e registra cada série em poucos toques.

---

## 3. Requisitos funcionais

### 3.1 Autenticação e sessão

| ID | Descrição | Prioridade | Persona | Cliente |
|---|---|---|---|---|
| RF-001 | O personal entra no web informando e-mail e senha e recebe acesso às funcionalidades do seu perfil | Alta | Fernanda | web |
| RF-002 | O personal encerra a sessão e deixa de ter acesso às páginas protegidas | Alta | Fernanda | web |
| RF-003 | O personal cria a própria conta pelo web, informando nome, e-mail e senha | Alta | Fernanda | web |
| RF-004 | O aluno entra no app informando apenas o e-mail (login simulado, sem senha e sem token) e o app passa a exibir os dados desse aluno | Alta | Marcos | mobile |

### 3.2 Catálogo de exercícios

| ID | Descrição | Prioridade | Persona | Cliente |
|---|---|---|---|---|
| RF-010 | O personal cadastra um exercício no catálogo, com nome e grupo muscular | Alta | Fernanda | web |
| RF-011 | O personal edita ou remove um exercício do catálogo | Média | Fernanda | web |
| RF-012 | O catálogo de exercícios pode ser consultado pelos dois clientes | Alta | Fernanda, Marcos | web / mobile |

### 3.3 Gestão de alunos

| ID | Descrição | Prioridade | Persona | Cliente |
|---|---|---|---|---|
| RF-020 | O personal lista e busca os próprios alunos | Alta | Fernanda | web |
| RF-021 | O personal cadastra um novo aluno, definindo uma senha provisória | Alta | Fernanda | web |
| RF-022 | O personal edita os dados de um aluno | Baixa | Fernanda | web |
| RF-023 | O personal remove um aluno que ainda não tem ficha | Baixa | Fernanda | web |
| RF-024 | O personal abre o detalhe de um aluno | Média | Fernanda | web |

### 3.4 Fichas de treino

| ID | Descrição | Prioridade | Persona | Cliente |
|---|---|---|---|---|
| RF-030 | O personal monta uma ficha para um aluno, com uma lista ordenada de exercícios. Cada item é de **força** (séries-alvo, repetições-alvo e carga sugerida inicial) ou de **cardio** (duração, velocidade e inclinação), e usa um exercício do catálogo ou um nome personalizado | Alta | Fernanda | web |
| RF-031 | O personal edita a ficha de um aluno, adicionando, removendo ou ajustando itens | Média | Fernanda | web |
| RF-032 | O aluno consulta a própria ficha ativa | Alta | Marcos | mobile |
| RF-033 | Um aluno pode ter até 7 fichas, distribuídas na semana pela ordem de criação: a 1ª é a de segunda, a 2ª a de terça... e a 7ª a de domingo. Dia sem ficha é dia de repouso | Média | Fernanda, Marcos | web / mobile |

### 3.5 Execução de treino

| ID | Descrição | Prioridade | Persona | Cliente |
|---|---|---|---|---|
| RF-040 | O aluno inicia uma sessão de treino a partir da própria ficha | Alta | Marcos | mobile |
| RF-041 | O aluno registra carga usada e repetições feitas em cada série de cada exercício da sessão | Alta | Marcos | mobile |
| RF-042 | O aluno finaliza a sessão, e o sistema recalcula automaticamente a carga sugerida de cada exercício de força para a próxima vez | Alta | Marcos | mobile |

### 3.6 Evolução e acompanhamento

| ID | Descrição | Prioridade | Persona | Cliente |
|---|---|---|---|---|
| RF-050 | O personal consulta a evolução de carga de um aluno em um exercício específico, ao longo do tempo | Média | Fernanda | web |
| RF-051 | O aluno consulta o histórico das últimas sessões realizadas | Baixa | Marcos | mobile |

### 3.7 Solicitações de atendimento

| ID | Descrição | Prioridade | Persona | Cliente |
|---|---|---|---|---|
| RF-060 | O aluno sem personal envia, pelo app, uma solicitação de atendimento informando o e-mail do personal | Média | Marcos | mobile |
| RF-061 | O personal vê as solicitações pendentes enviadas a ele | Média | Fernanda | web |
| RF-062 | O personal aceita uma solicitação, e o aluno passa a ser dele | Média | Fernanda | web |
| RF-063 | O personal recusa uma solicitação | Média | Fernanda | web |
| RF-064 | **Em aberto:** como nasce a conta de um aluno que ainda não tem personal (cadastro pelo app ou apenas pelo seed). Hoje esses alunos são criados pelo seed | — | Marcos | a definir |

---

## 4. Requisitos não funcionais

| ID | Categoria | Descrição | Critério de aceitação |
|---|---|---|---|
| RNF-001 | Segurança — credenciais | Senhas são armazenadas com hash e nunca em texto puro | Nenhuma senha legível no banco; a coluna guarda o hash bcrypt; nenhuma resposta da API devolve a senha |
| RNF-002 | Segurança — sessão (web) | O acesso do personal é feito por token JWT, com validade definida | Token expirado é recusado com `401`; o token fica em cookie `httpOnly` |
| RNF-003 | Segurança — rotas | As rotas de alunos e de solicitações exigem token de personal e só devolvem dados do próprio personal | Requisição sem token recebe `401`; aluno ou solicitação de outro personal responde `404`. As demais rotas ainda não têm guard (pendência registrada no contrato, seção 2.3) |
| RNF-004 | Segurança — segredos | Chaves e credenciais ficam em variável de ambiente | Nenhum segredo versionado no repositório (`JWT_SECRET` e `DATABASE_URL` no `.env`) |
| RNF-005 | Desempenho | Registrar uma série executada responde rápido o suficiente para não quebrar o ritmo do treino | `POST /sessoes-treino/:id/series` responde em menos de 1s em ambiente de desenvolvimento |
| RNF-006 | Usabilidade (mobile) | Registrar uma série exige o mínimo de toques possível, pensando em uso com uma mão só entre séries | Registrar carga e repetições de uma série leva no máximo 2 toques após abrir a sessão |
| RNF-007 | Manutenibilidade | Regra de sobrecarga progressiva concentrada em um único ponto do backend | Nenhuma lógica de cálculo de carga duplicada em `web/` ou `mobile/` |
| RNF-008 | Comportamento em rede instável (mobile) | O app não perde os dados de séries já preenchidas se a conexão cair no meio do treino, e avisa o aluno de forma clara | Ao perder conexão após preencher uma série, o app mantém o valor em tela e permite reenviar quando a rede voltar; toda chamada tem tempo limite de 10s e falhas de conexão, tempo esgotado e erro da API aparecem como mensagens distintas |
| RNF-009 | Consistência entre clientes | Um dado criado em um cliente aparece corretamente no outro sem transformação adicional | Uma ficha criada no web é exibida com os mesmos valores no mobile |

---

## 5. Regras de negócio

| ID | Regra | Validação antecipada no cliente? |
|---|---|---|
| RN-001 | Ao finalizar uma sessão, a carga sugerida de cada item de força é recalculada a partir da carga usada na última série: sobe 5% se o aluno completou a repetição-alvo em todas as séries do item, reduz 5% se ficou abaixo do alvo em mais de uma série, e mantém nos demais casos. Itens de cardio e itens sem carga sugerida ficam fora do cálculo | não |
| RN-002 | Uma ficha não pode ter duas sessões `em_andamento` ao mesmo tempo | não |
| RN-003 | Um item de ficha não pode ser removido depois de ter alguma série executada registrada contra ele — o histórico não pode ser perdido. Pelo mesmo motivo, não se remove ficha com sessão nem aluno com ficha | sim, o web pode ocultar a opção de remover, mas o backend é quem recusa com `409` |
| RN-004 | Uma sessão finalizada não aceita novas séries nem pode ser finalizada de novo; uma sessão sem nenhuma série não pode ser finalizada | sim, o app trava os campos após finalizar, mas o backend é a fonte da verdade |
| RN-005 | Cada item de ficha usa **ou** um exercício do catálogo **ou** um nome personalizado — nunca os dois, nunca nenhum. Item de força exige séries-alvo e repetições-alvo; item de cardio exige duração | sim, no formulário do web; o backend recusa com `400` |
| RN-006 | Um aluno não pode ter duas solicitações pendentes para o mesmo personal | sim, no app; o backend é a fonte da verdade |
| RN-007 | Ao aceitar uma solicitação, o aluno passa a ser do personal que aceitou e todas as solicitações pendentes desse aluno (inclusive para outros personals) são apagadas | não |

**Autorização — quem pode o quê.** A tabela completa vive em `docs/contrato-api.md`, seção 2.3.

| ID | Regra de autorização | Perfil |
|---|---|---|
| RN-A01 | Um aluno só vê e altera as próprias fichas e sessões. Com o login simulado, isso é garantido pelo app, que só usa o `id` do aluno logado | `aluno` |
| RN-A02 | Um personal só vê e altera alunos, fichas e solicitações vinculados a ele mesmo | `personal` |
| RN-A03 | Apenas o personal cadastra exercícios, alunos e fichas — o aluno nunca cria esses recursos | `personal` |

---

## 6. Modelo de dados

### 6.1 Diagrama ER

```mermaid
erDiagram
  PERSONAL {
    uuid id PK
    string nome
    string email
    string senha
  }
  ALUNO {
    uuid id PK
    string nome
    string email
    string senha
    uuid personalId FK "nulo ate ser aceito"
  }
  SOLICITACAO {
    uuid id PK
    uuid alunoId FK
    uuid personalId FK
    timestamp createdAt
  }
  FICHA {
    uuid id PK
    uuid alunoId FK
    uuid personalId FK
  }
  ITEM_FICHA {
    uuid id PK
    uuid fichaId FK
    uuid exercicioId FK "ou nomePersonalizado"
    string nomePersonalizado
    string tipo "forca | cardio"
    int ordem
    int seriesAlvo
    int repeticoesAlvo
    float cargaSugerida
    int duracaoMin
    float velocidadeKmh
    float inclinacaoPct
  }
  EXERCICIO {
    uuid id PK
    string nome
    string grupoMuscular
  }
  SESSAO_TREINO {
    uuid id PK
    uuid alunoId FK
    uuid fichaId FK
    timestamp data
    string situacao
  }
  SERIE_EXECUTADA {
    uuid id PK
    uuid sessaoTreinoId FK
    uuid itemFichaId FK
    int numeroSerie
    float cargaUsada
    int repeticoesFeitas
  }

  PERSONAL ||--o{ ALUNO : "atende"
  ALUNO ||--o{ SOLICITACAO : "envia"
  PERSONAL ||--o{ SOLICITACAO : "recebe"
  PERSONAL ||--o{ FICHA : "monta"
  ALUNO ||--o{ FICHA : "recebe"
  FICHA ||--o{ ITEM_FICHA : "contem"
  EXERCICIO |o--o{ ITEM_FICHA : "e referenciado por"
  ALUNO ||--o{ SESSAO_TREINO : "executa"
  FICHA ||--o{ SESSAO_TREINO : "baseia"
  SESSAO_TREINO ||--o{ SERIE_EXECUTADA : "registra"
  ITEM_FICHA ||--o{ SERIE_EXECUTADA : "e executado em"
```

### 6.2 Descrição das entidades

| Entidade | Responsabilidade | Principais atributos |
|---|---|---|
| Personal | Profissional que monta fichas, aceita alunos e acompanha a evolução | nome, email, senha (hash) |
| Aluno | Pessoa que treina, dona das fichas e sessões | nome, email, senha (hash), personalId (nulo até ser aceito) |
| Solicitacao | Pedido pendente de um aluno para ser atendido por um personal; some quando aceito ou recusado | alunoId, personalId (par único) |
| Exercicio | Item de catálogo reutilizável entre fichas | nome (único), grupoMuscular |
| Ficha | Prescrição de treino de um personal para um aluno, correspondente a um dia da semana pela ordem de criação (RF-033) | alunoId, personalId, createdAt |
| ItemFicha | Um exercício dentro de uma ficha, de força ou de cardio, com meta e carga sugerida | tipo, ordem, exercicioId ou nomePersonalizado, seriesAlvo, repeticoesAlvo, cargaSugerida, duracaoMin, velocidadeKmh, inclinacaoPct |
| SessaoTreino | Uma execução da ficha em uma data | data, situacao |
| SerieExecutada | Registro real de uma série dentro de uma sessão | numeroSerie, cargaUsada, repeticoesFeitas |

---

## 7. Recorte web/mobile

| Funcionalidade | Web | Mobile | Justificativa |
|---|---|---|---|
| Entrada no sistema | ✅ (personal, e-mail e senha) | ✅ (aluno, só e-mail — simulado) | Cada perfil entra pelo seu cliente; o login do app foi simplificado por orientação do professor |
| Cadastro de exercícios | ✅ | — | Tarefa de configuração, feita sentado, sem urgência de mobilidade |
| Cadastro e gestão de alunos | ✅ | — | Tarefa administrativa do personal, tela grande facilita revisão |
| Montagem e edição de fichas | ✅ | — | Requer visão de conjunto (vários exercícios, ordem, metas) que cabe melhor em tela grande |
| Consulta da ficha ativa | ✅ (personal vê a do aluno) | ✅ (aluno vê a própria) | O aluno precisa da ficha em mãos na academia; o personal revisa o que montou |
| Execução de treino (iniciar sessão, registrar série, finalizar) | — | ✅ | É o núcleo do uso em movimento, com o celular na mão entre séries — não faz sentido em uma tela de computador na academia |
| Solicitação de atendimento | ✅ (personal aceita ou recusa) | ✅ (aluno envia) | Quem procura o personal é o aluno, de qualquer lugar; quem decide é o personal, ao organizar a agenda |
| Evolução de carga por exercício (gráfico) | ✅ | — | Análise histórica, com mais espaço de tela; cortado do mobile no MVP para não competir com o fluxo rápido de execução |
| Histórico de sessões recentes | — | ✅ (versão simples, sem gráfico) | O aluno quer conferir rapidamente o que fez na última vez, sem esperar carregar um painel |

**O que ficou de fora do mobile e por quê:** cadastro de exercícios, gestão de alunos e montagem de fichas — são tarefas do personal, que usa o web; e o gráfico de evolução, que fica mais legível em tela grande e não é essencial durante o treino.

**O que ficou de fora do web e por quê:** o fluxo de execução de treino (iniciar sessão, registrar série a série) e o envio de solicitação — não há cenário em que o personal execute o treino do aluno, ou peça atendimento a si mesmo, pelo navegador.

**Recorte mobile mínimo (1 a 3 casos de uso, com leitura e escrita na API):**
- Entrar pelo e-mail e consultar a ficha ativa (leitura)
- Iniciar sessão, registrar séries executadas e finalizar a sessão (leitura e escrita — dispara o recálculo de sobrecarga progressiva)
- Enviar solicitação de atendimento a um personal (escrita)

---

## 8. Arquitetura da solução

### 8.1 Visão geral dos componentes

```mermaid
flowchart TD
  W["Cliente web — Next.js (App Router)<br/>Server Components, Server Actions e cookie httpOnly"]
  M["App mobile — Flutter 3<br/>Screens, Widgets e TreinoApi (pacote http)"]
  A["API REST — NestJS<br/>Controller · Service · Prisma"]
  D["PostgreSQL 18"]
  W -->|HTTP / JSON + Bearer token| A
  M -->|HTTP / JSON, login simulado| A
  A --> D
```

### 8.2 Estrutura dos três projetos

| Componente | Desvio em relação ao README | Motivo |
|---|---|---|
| Backend | Porta 3001 em vez de 3000; `schema.prisma` gera o client em `src/generated/prisma` | O Next.js usa a 3000 no desenvolvimento |
| Cliente web | nenhum registrado | — |
| App mobile | Cliente da API em `lib/treino_api.dart`, telas em `lib/screens/`, componentes em `lib/widgets/`, modelos em `lib/models/` | Segue a organização do laboratório de consumo de API da disciplina |

### 8.3 Módulos e recursos do backend

| Módulo | Recurso do domínio | Endpoints |
|---|---|---|
| PersonalModule | Personal (conta e login) | `POST /personal/register`, `POST /personal/login` |
| AppAlunoModule | Login simulado do aluno | `POST /app/login` |
| ExerciciosModule | Exercicio | `GET/POST/PATCH/DELETE /exercicios` |
| AlunosModule | Aluno | `GET/POST/PATCH/DELETE /alunos` |
| FichasModule | Ficha, ItemFicha | `GET/POST/PATCH/DELETE /fichas`, `POST /fichas/:id/itens`, `PATCH/DELETE /itens-ficha/:id` |
| SessoesTreinoModule | SessaoTreino, SerieExecutada | `GET/POST /sessoes-treino`, `POST /sessoes-treino/:id/series`, `POST /sessoes-treino/:id/finalizar` |
| SolicitacoesModule | Solicitacao | `GET /solicitacoes`, `POST /solicitacoes/:id/aceitar`, `DELETE /solicitacoes/:id`; previsto: `POST /solicitacoes` |
| AlunosModule (evolução) | consulta agregada | previsto: `GET /alunos/:alunoId/exercicios/:exercicioId/evolucao` |

### 8.4 Decisões técnicas por componente

| Componente | Decisão a tomar | Escolha do grupo | Justificativa |
|---|---|---|---|
| Backend | Estratégia de autenticação | JWT simples (HS256, biblioteca `jose`), sem refresh token, só para o personal | Validade de 8h é suficiente para o uso diário; simplifica o MVP dado o prazo |
| Backend | Formato de identificador | uuid | Já adotado no `schema.prisma` |
| Web | Fronteira Server / Client Components | Server Components para listagens e leitura (alunos, fichas); Client Components para formulários; chamadas ao backend feitas no servidor Next | O token fica em cookie `httpOnly` e nunca chega ao JavaScript do navegador |
| Web | Estratégia de revalidação e cache | Revalidação sob demanda (`revalidatePath`) após cada mutação | Domínio transacional — dados desatualizados por cache agressivo geram decisão errada de carga |
| Mobile | Gerência de estado | `setState` | Suficiente para o recorte mínimo (ficha do dia + registro de série) |
| Mobile | Nível de autenticação | **Simulada** — `POST /app/login` só com e-mail, sem senha e sem token; o `Aluno` fica em memória | O professor, em aula, deixou de exigir token no app; o objetivo do login é só saber de qual aluno puxar o treino |
| Mobile | Camada de acesso à API | Pacote `http`; classe `TreinoApi` com `http.Client` injetável, URL por `--dart-define`, tempo limite de 10s e falhas tipadas (`SemConexao`, `TempoEsgotado`, `ErroDaApi`, `RespostaInesperada`) | Segue o laboratório da disciplina; permite testar com `MockClient` e mostrar mensagem clara para cada tipo de falha |

### 8.5 Tecnologias e versões

| Tecnologia | Versão | Papel |
|---|---|---|
| Node.js | 24 | Runtime do backend |
| NestJS | 12 | Framework da API |
| Prisma | 7 (com `@prisma/adapter-pg`) | ORM e migrations |
| PostgreSQL | 18 | Banco de dados |
| React | 19 | Biblioteca de interface |
| Next.js | 16 (App Router) | Framework do cliente web |
| Flutter / Dart | 3.50 / 3.14 | Framework do app mobile |
| Docker | opcional | Banco de dados local (`docker-compose.yml`) |

---

## 9. Planejamento de sprints

| Sprint | Etapa | Tema | Requisitos previstos | Responsáveis | Entregáveis |
|---|---|---|---|---|---|
| 1 | Etapa 1 | Contrato e fundação | — | ambos | PRD, contrato e backend rodando |
| 2 | Etapa 2 | Backend: catálogo, alunos e fichas | RF-010 a RF-012, RF-020 a RF-022, RF-030 a RF-032 | ambos (regra dos dois componentes) | CRUDs respondendo, sem auth ainda |
| 3 | Etapa 2 / 3 | Backend: sessão de treino e sobrecarga progressiva; início do web | RF-040 a RF-042, RN-001 a RN-005 | ambos | Endpoints do MVP completos; navegação inicial do web |
| 4 | Etapa 3 | Cliente web completo | RF-001 a RF-003, RF-010, RF-011, RF-020 a RF-024, RF-030, RF-031, RF-050, RF-061 a RF-063 | Othavio (web) | Fluxo principal do personal navegável |
| 5 | Etapa 4 | App mobile completo | RF-004, RF-032, RF-040 a RF-042, RF-051, RF-060 | Arthur (mobile) | Fluxo principal do aluno no emulador |
| 6 | Etapa 5 | Integração e fechamento | RF-064 (decidir), pendências do contrato | ambos | Entrega final, relatório e vídeo |

> Datas de cada sprint seguem o calendário da turma — preencher assim que publicado.

---

## 10. Critérios de aceite (MVP)

- [ ] Personal cria a conta ou faz login, cadastra um exercício, cadastra um aluno e monta uma ficha completa para ele, tudo pelo web
- [ ] Aluno entra no mobile pelo e-mail e vê a ficha montada pelo personal, com os exercícios na ordem correta
- [ ] Aluno inicia uma sessão, registra série a série (carga e repetições) e finaliza — a carga sugerida do próximo treino é recalculada conforme RN-001
- [ ] Um registro criado pelo cliente web aparece corretamente no app mobile, e vice-versa
- [ ] O app identifica o aluno pelo login simulado e vê os mesmos dados que o personal vê no cliente web
- [ ] Aluno envia uma solicitação pelo app, o personal a vê no web, aceita, e o aluno passa a aparecer na lista de alunos dele
- [ ] Personal consulta a evolução de carga do aluno naquele exercício e vê o valor recém-calculado refletido

---

## 11. Fora do escopo (explícito)

- Refresh token e recuperação de senha — login simples com token de validade fixa
- Senha e token no app mobile — o login do aluno é simulado (seção 8.4)
- Um aluno ter mais de um personal ao mesmo tempo
- Notificações push para lembrar o aluno de treinar ou avisar que a solicitação foi aceita
- Parametrização do percentual de sobrecarga progressiva por personal — fica fixo em 5% no backend (RN-001)
- Progressão automática de itens de cardio
- Edição de uma série já registrada, ou de uma sessão já finalizada
- Gráfico de evolução no app mobile — fica só no web (seção 7)

---

## 12. Histórico de revisões

| Versão | Data | Descrição |
|---|---|---|
| 1.0 | 2026-09-12 | Versão inicial |
| 1.1 | 2026-11-23 | Alinha o escopo ao que foi implementado e decidido: login simulado do aluno no app (orientação do professor em aula) e cadastro do personal pelo web; solicitações de atendimento (RF-060 a RF-064, RN-006, RN-007); itens de cardio e nome personalizado (RF-030, RN-005); cardio fora da sobrecarga progressiva (RN-001); modelo de dados, módulos, versões e responsáveis atualizados; pendências de segurança registradas |
| 1.2 | 2026-11-25 | Fichas por dia da semana (RF-033), conforme a tela de fichas do web (`c63c927`) |
